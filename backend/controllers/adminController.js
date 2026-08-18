const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../config/db');
require('dotenv').config();

// Helper to validate password strength
const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return password.length >= minLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
};

// 1. Admin Sign-Up
exports.signup = async (req, res) => {
  const { username, email, password, confirmPassword, full_name } = req.body;

  if (!username || !email || !password || !confirmPassword || !full_name) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  if (!validatePasswordStrength(password)) {
    return res.status(400).json({ 
      error: 'Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.' 
    });
  }

  try {
    // Check if username or email already exists
    const checkUser = await db.query(
      'SELECT id FROM admin_users WHERE username = $1 OR email = $2', 
      [username.trim(), email.trim().toLowerCase()]
    );

    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: 'Username or Email is already registered.' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate secure email verification token (expires in 24 hours)
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 Hours

    // Insert new administrator
    const insertQuery = `
      INSERT INTO admin_users (username, email, password, full_name, role, is_verified, verification_token, verification_token_expires)
      VALUES ($1, $2, $3, $4, 'admin', FALSE, $5, $6)
      RETURNING id, username, email;
    `;
    const result = await db.query(insertQuery, [
      username.trim(),
      email.trim().toLowerCase(),
      passwordHash,
      full_name.trim(),
      verificationToken,
      verificationExpires
    ]);

    // Print verification email to console for developer convenience
    const verificationUrl = `http://localhost:5173/admin/verify-email?token=${verificationToken}`;
    console.log('\n==================================================');
    console.log('[EMAIL DISPATCH - VERIFY EMAIL]');
    console.log(`To: ${email}`);
    console.log(`Link: ${verificationUrl}`);
    console.log('==================================================\n');

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      admin: result.rows[0]
    });
  } catch (error) {
    console.error('Admin signup error:', error);
    res.status(500).json({ error: 'Server error occurred during sign-up.' });
  }
};

// 2. Email Verification
exports.verifyEmail = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Verification token is required.' });
  }

  try {
    // Look up admin by token and verify expiration
    const result = await db.query(
      'SELECT id, verification_token_expires FROM admin_users WHERE verification_token = $1',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired verification token.' });
    }

    const admin = result.rows[0];
    if (new Date(admin.verification_token_expires) < new Date()) {
      return res.status(400).json({ error: 'Verification token has expired. Please sign up again.' });
    }

    // Set verified flag
    await db.query(
      'UPDATE admin_users SET is_verified = TRUE, verification_token = NULL, verification_token_expires = NULL WHERE id = $1',
      [admin.id]
    );

    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Server error during verification.' });
  }
};

// 3. Admin Login
exports.login = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  if (!emailOrUsername || !password) {
    return res.status(400).json({ error: 'Please enter all login credentials.' });
  }

  try {
    // Search by username or email
    const result = await db.query(
      'SELECT * FROM admin_users WHERE username = $1 OR email = $1',
      [emailOrUsername.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid admin credentials.' });
    }

    const admin = result.rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid admin credentials.' });
    }

    // Assert email verification
    if (!admin.is_verified) {
      return res.status(403).json({ error: 'Please verify your email address before logging in.' });
    }

    // Record login timestamp
    await db.query('UPDATE admin_users SET last_login = NOW() WHERE id = $1', [admin.id]);

    // Generate Admin JWT
    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET || 'intelearn_secret_key_2026',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Access granted.',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during authorization.' });
  }
};

// 4. Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Please specify your registered email address.' });
  }

  try {
    const result = await db.query('SELECT id FROM admin_users WHERE email = $1', [email.trim().toLowerCase()]);

    if (result.rows.length === 0) {
      // Respond with success to prevent email verification harvesting
      return res.json({ message: 'If the email matches an admin account, a password reset link has been dispatched.' });
    }

    const admin = result.rows[0];
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 Hour

    await db.query(
      'UPDATE admin_users SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3',
      [resetToken, resetExpires, admin.id]
    );

    const resetUrl = `http://localhost:5173/admin/reset-password/${resetToken}`;
    console.log('\n==================================================');
    console.log('[EMAIL DISPATCH - PASSWORD RESET]');
    console.log(`To: ${email}`);
    console.log(`Link: ${resetUrl}`);
    console.log('==================================================\n');

    res.json({ message: 'If the email matches an admin account, a password reset link has been dispatched.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error executing password reset request.' });
  }
};

// 5. Reset Password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Reset token and new password are required.' });
  }

  if (!validatePasswordStrength(newPassword)) {
    return res.status(400).json({ 
      error: 'Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.' 
    });
  }

  try {
    const result = await db.query(
      'SELECT id, reset_password_expires FROM admin_users WHERE reset_password_token = $1',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired password reset token.' });
    }

    const admin = result.rows[0];
    if (new Date(admin.reset_password_expires) < new Date()) {
      return res.status(400).json({ error: 'Password reset token has expired.' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Save and wipe token
    await db.query(
      'UPDATE admin_users SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2',
      [passwordHash, admin.id]
    );

    res.json({ message: 'Password has been reset successfully. You can now login.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Server error resetting password.' });
  }
};

// 6. Change Password (Authenticated)
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Old password and new password are required.' });
  }

  if (!validatePasswordStrength(newPassword)) {
    return res.status(400).json({ 
      error: 'New password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.' 
    });
  }

  try {
    // req.user is loaded by authenticateAdmin middleware
    const result = await db.query('SELECT password FROM admin_users WHERE id = $1', [req.user.id]);
    const admin = result.rows[0];

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect current password.' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE admin_users SET password = $1 WHERE id = $2', [passwordHash, req.user.id]);

    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Server error changing password.' });
  }
};

// 7. Get Current Session
exports.getMe = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, username, email, full_name, role, is_verified, last_login, created_at FROM admin_users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error retrieving current profile.' });
  }
};
