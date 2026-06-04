require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
  }
});
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
   }
});
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');



const app = express();
app.use(cors());
app.use(express.json()); 
app.use('/uploads', express.static('uploads'));

// Set up PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// ------------------------------------
// JWT AUTH MIDDLEWARE
// ------------------------------------
const authenticateToken = (req, res, next) => {

  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.user = user;

    next();
  });
};

// ------------------------------------
// MULTER CONFIG
// ------------------------------------
const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    const uploadPath = './uploads';

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Only accept PDFs
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // Optional: limit file size to 10MB
});

// ------------------------------------
// THE REGISTER ROUTE
// ------------------------------------
app.post('/register', async (req, res) => {
  const { email, password, role } = req.body; 
  
  // Removed '!role' because role is not passed during a standard login attempt
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }
  // ----------------------------------

  try {
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role',
      [email, passwordHash, role]
    );

    res.status(201).json({ message: 'User created successfully', user: newUser.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ------------------------------------
// THE LOGIN ROUTE
// ------------------------------------
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // --- NEW QUICK CHECK ADDED HERE ---
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }
  // ----------------------------------

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ token, role: user.rows[0].role, message: 'Login successful' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ------------------------------------
// FORGOT PASSWORD - Generate & Send OTP
// ------------------------------------
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await pool.query(
      'SELECT * FROM users WHERE email=$1',
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Email not found' });
    }

    // ✅ Generate 5-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // expiry time (10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Save OTP in DB (IMPORTANT)
    await pool.query(
      `UPDATE users 
       SET reset_otp = $1, reset_otp_expires_at = $2 
       WHERE email = $3`,
      [otp, expiresAt, email]
    );

    // Send OTP email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP is: ${otp}`
    });

    res.json({ message: 'OTP sent successfully' });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      error: 'Email and OTP are required'
    });
  }

  try {
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const user = userResult.rows[0];

    // Check OTP
    if (user.reset_otp != otp) {
      return res.status(400).json({
        error: 'Invalid OTP'
      });
    }

    // Check expiry
    if (new Date() > new Date(user.reset_otp_expires_at)) {
      return res.status(400).json({
        error: 'OTP expired'
      });
    }

    res.json({
      message: 'OTP verified successfully'
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: 'Server error'
    });
  }
});

// ------------------------------------
// RESET PASSWORD - Verify OTP & Update
// ------------------------------------
app.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // OTP check
    if (user.reset_otp != otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // expiry check
    if (new Date() > new Date(user.reset_otp_expires_at)) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

      await pool.query(
        `UPDATE users 
        SET password_hash = $1,
            reset_otp = NULL,
            reset_otp_expires_at = NULL
        WHERE email = $2`,
        [hashedPassword, email]
      );

    res.json({ message: 'Password reset successful' });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ------------------------------------
// ADD COURSE
// ------------------------------------
app.post('/courses', authenticateToken, async (req, res) => {

  const { title, description } = req.body;

  try {

    const lecturerId = req.user.id;

    const newCourse = await pool.query(
      `INSERT INTO courses 
      (title, description, lecturer_id)
      VALUES ($1, $2, $3)
      RETURNING *`,
      [title, description, lecturerId]
    );

    res.status(201).json(newCourse.rows[0]);

  } catch (err) {

    console.error(err.message);

    res.status(500).json({ error: 'Server error' });
  }
});

// ------------------------------------
// GET ALL COURSES
// ------------------------------------
app.get('/courses', authenticateToken, async (req, res) => {

  try {

    const courses = await pool.query(`
      SELECT 
        courses.*,
        users.email AS lecturer_email
      FROM courses
      JOIN users
      ON courses.lecturer_id = users.id
    `);

    res.json(courses.rows);

  } catch (err) {

    console.error(err.message);

    res.status(500).json({ error: 'Server error' });
  }
});

// ------------------------------------
// GET SINGLE COURSE WITH MATERIALS
// ------------------------------------
app.get('/courses/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Fetch the course details
    const courseResult = await pool.query(
      'SELECT * FROM courses WHERE id = $1',
      [id]
    );

    if (courseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const course = courseResult.rows[0];

    // 2. Fetch the associated materials (Lessons/Modules)
    const materialsResult = await pool.query(
      'SELECT id, title, material_url, created_at FROM course_materials WHERE course_id = $1 ORDER BY created_at ASC',
      [id]
    );

    // 3. Combine and return
    res.json({
      ...course,
      materials: materialsResult.rows
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ------------------------------------
// UPLOAD COURSE MATERIAL
// ------------------------------------
app.post(
  '/upload-material',
  authenticateToken,
  upload.single('file'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No valid PDF file uploaded' });
    }

    // ADDED 'title' HERE
    const { course_id, title } = req.body; 
    const filePath = req.file.path;

    if (!title) {
      // Cleanup file if title is missing
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'Lesson title is required' });
    }

    try {
      const pdfBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(pdfBuffer);
      const extractedText = pdfData.text;

      const prompt = `
      You are an AI tutor for an LMS system.
      From the following course content:
      1. Create a short COURSE DESCRIPTION (important key points summary)
      2. Generate exactly 5 MCQs

      Rules:
      - Each MCQ must have question, A, B, C, D, correct answer
      - Output ONLY valid JSON using this schema:
      {
        "courseDescription": "string",
        "mcqs": [
          { "question": "string", "A": "string", "B": "string", "C": "string", "D": "string", "answer": "A/B/C/D" }
        ]
      }

      CONTENT:
      ${extractedText}
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const aiData = JSON.parse(responseText);

      // UPDATED DATABASE INSERT TO INCLUDE 'title'
      const newMaterial = await pool.query(
        `INSERT INTO course_materials (course_id, title, material_url) VALUES ($1, $2, $3) RETURNING *`,
        [course_id, title, filePath]
      );

      res.status(201).json({
        message: 'Material uploaded successfully',
        material: newMaterial.rows[0],
        aiGeneratedContent: aiData
      });

    } catch (err) {
      console.error(err.message);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      res.status(500).json({ error: 'Server error during processing' });
    }
});
// ------------------------------------
// ENROLL STUDENT
// ------------------------------------
app.post('/enroll', authenticateToken, async (req, res) => {

  try {

    const studentId = req.user.id;

    const { course_id } = req.body;

    await pool.query(
      `INSERT INTO enrollments
      (student_id, course_id)
      VALUES ($1, $2)`,
      [studentId, course_id]
    );

    res.json({
      message: 'Enrolled successfully'
    });

  } catch (err) {

    console.error(err.message);

    res.status(500).json({ error: 'Server error' });
  }
});

// ------------------------------------
// CREATE QUIZ
// ------------------------------------
app.post('/quizzes', authenticateToken, async (req, res) => {

  try {

    const { course_id, title } = req.body;

    const quiz = await pool.query(
      `INSERT INTO quizzes
      (course_id, title)
      VALUES ($1, $2)
      RETURNING *`,
      [course_id, title]
    );

    res.status(201).json(quiz.rows[0]);

  } catch (err) {

    console.error(err.message);

    res.status(500).json({ error: 'Server error' });
  }
});

// ------------------------------------
// ADD QUESTIONS
// ------------------------------------
app.post('/questions', authenticateToken, async (req, res) => {

  try {

    const {
      quiz_id,
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer
    } = req.body;

    const newQuestion = await pool.query(
      `INSERT INTO questions
      (
        quiz_id,
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [
        quiz_id,
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer
      ]
    );

    res.status(201).json(newQuestion.rows[0]);

  } catch (err) {

    console.error(err.message);

    res.status(500).json({ error: 'Server error' });
  }
});

// Start the server
// Add '0.0.0.0' to tell Express to accept network connections
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});