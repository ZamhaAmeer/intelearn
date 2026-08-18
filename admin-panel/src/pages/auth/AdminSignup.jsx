import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { School, User, Mail, Lock, KeyRound, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminSignup() {
  const { signup } = useAuth();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Password strength checking
  const checkPasswordStrength = (pass) => {
    if (!pass) return '';
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score++;

    if (score < 3) return 'weak';
    if (score < 5) return 'medium';
    return 'strong';
  };

  const strength = checkPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName.trim() || !username.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all registration fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (strength !== 'strong') {
      setError('Password must satisfy all strength guidelines (8+ characters, uppercase, lowercase, numbers, special symbols).');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const res = await signup(username.trim(), email.trim().toLowerCase(), password, confirmPassword, fullName.trim());
    if (res.success) {
      setSuccess(res.message || 'Registration completed. Check terminal console for mock verification link!');
      // Clear forms
      setFullName('');
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } else {
      setError(res.error || 'Registration failed.');
    }
    setLoading(false);
  };

  return (
    <div style={styles.authBg}>
      <div style={styles.authCard}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoWrapper}>
            <School size={36} color="var(--primary)" />
          </div>
          <h1 style={styles.brand}>INTELEARN</h1>
          <p style={styles.subtitle}>Administrative Registration</p>
        </div>

        {/* Notifications Banners */}
        {error && (
          <div className="alert-banner alert-banner-error" style={{ marginBottom: '20px' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert-banner alert-banner-success" style={{ marginBottom: '20px' }}>
            <CheckCircle size={18} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        {/* Signup form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Chief Admin"
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); setError(''); }}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Username</label>
              <div className="input-wrapper">
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. admin_chief"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  className="input-field"
                  placeholder="e.g. admin@intelearn.edu"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type="password"
                  className="input-field"
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  disabled={loading}
                />
              </div>
              {password && (
                <div style={{ marginTop: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)' }}>
                    <span>Strength</span>
                    <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{strength}</span>
                  </div>
                  <div className="password-strength-meter">
                    <div className={`password-strength-bar strength-${strength}`} />
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-wrapper">
                <KeyRound className="input-icon" size={18} />
                <input
                  type="password"
                  className="input-field"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Submitting Registration...' : 'Create Account'}
          </button>
        </form>

        <div style={styles.footer}>
          <p>Already have an admin account? <Link to="/admin/login" style={styles.footerLink}>Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  authBg: {
    height: '100vh',
    width: '100%',
    backgroundColor: '#2b0a90',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  authCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '540px',
    padding: '40px 30px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
  },
  header: {
    marginBottom: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px'
  },
  logoWrapper: {
    width: 60,
    height: 60,
    borderRadius: '50%',
    backgroundColor: 'rgba(91, 60, 194, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px'
  },
  brand: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2b0a90',
    letterSpacing: '1px',
    lineHeight: '1'
  },
  subtitle: {
    fontSize: '13px',
    color: 'var(--text-muted)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  submitBtn: {
    marginTop: '20px',
    padding: '12px',
    fontSize: '15px'
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '13px',
    color: 'var(--text-muted)'
  },
  footerLink: {
    color: 'var(--primary)',
    fontWeight: '600',
    textDecoration: 'none'
  }
};
