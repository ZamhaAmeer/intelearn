require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- NEW SEQUELIZE IMPORTS & MODELS ---
const sequelize = require('./config/database');
const User = require('./models/user');
const Course = require('./models/Course');
const CourseMaterial = require('./models/courseMaterial');
const Enrollment = require('./models/enrollment');
const Quiz = require('./models/quiz');
const Question = require('./models/question');

// --- DATABASE RELATIONSHIPS ---
// Lecturer -> Courses
User.hasMany(Course, { foreignKey: 'lecturer_id' });
Course.belongsTo(User, { foreignKey: 'lecturer_id' });

// Course -> Materials
Course.hasMany(CourseMaterial, { foreignKey: 'course_id' });
CourseMaterial.belongsTo(Course, { foreignKey: 'course_id' });

// Students <-> Courses (Enrollments)
User.hasMany(Enrollment, { foreignKey: 'student_id' });
Enrollment.belongsTo(User, { foreignKey: 'student_id' });
Course.hasMany(Enrollment, { foreignKey: 'course_id' });
Enrollment.belongsTo(Course, { foreignKey: 'course_id' });

// Course -> Quizzes
Course.hasMany(Quiz, { foreignKey: 'course_id' });
Quiz.belongsTo(Course, { foreignKey: 'course_id' });

// Quiz -> Questions
Quiz.hasMany(Question, { foreignKey: 'quiz_id' });
Question.belongsTo(Quiz, { foreignKey: 'quiz_id' });

// --- APP INITIALIZATION ---
const app = express();
app.use(cors());
app.use(express.json()); 
app.use('/uploads', express.static('uploads'));

// --- INTELEARN SERVICES CONFIG ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
  }
});

const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
   }
});

// ------------------------------------
// JWT AUTH MIDDLEWARE (Unchanged)
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
// MULTER CONFIG (Unchanged)
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
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }
});

// ------------------------------------
// THE REGISTER ROUTE (Sequelize Version)
// ------------------------------------
app.post('/register', async (req, res) => {
  const { full_name, email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }
  
  try {
    // Sequelize: Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Sequelize: Insert new user
    const newUser = await User.create({
      full_name,
      email,
      password_hash: passwordHash,
      role
    });

    res.status(201).json({ 
        message: 'User created successfully', 
        user: { 
            id: newUser.id, 
            full_name: newUser.full_name, 
            email: newUser.email, 
            role: newUser.role 
        } 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ------------------------------------
// THE LOGIN ROUTE (Sequelize Version)
// ------------------------------------
app.post('/login', async (req, res) => {
  const { email, password } = req.body;