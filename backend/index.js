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


const sequelize = require('./config/database');
const User = require('./models/user');
const Course = require('./models/Course');
const CourseMaterial = require('./models/courseMaterial');
const Enrollment = require('./models/enrollment');
const Quiz = require('./models/quiz');
const Question = require('./models/question');


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

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  try {
    // Sequelize: Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  
    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ 
      token, 
      role: user.role, 
      full_name: user.full_name, 
      message: 'Login successful' 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ------------------------------------
// UPDATE PROFILE ROUTE (Sequelize Version)
// ------------------------------------
app.put('/update-profile', async (req, res) => {
  const { full_name, username, email, phone, bio, department, gender } = req.body;

  try {
    // Sequelize: Update user and return the newly updated data
    const [updatedRowCount, updatedRows] = await User.update(
      { full_name, username, phone, bio, department, gender },
      { 
        where: { email },
        returning: true // Tells Postgres to give us the updated row back
      }
    );

    if (updatedRowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      message: 'Profile updated successfully', 
      user: updatedRows[0] 
    });
  } catch (err) {
    console.error("DEBUG - SQL FAILED:", err.message); 
    res.status(500).json({ error: 'Database Update Error: ' + err.message });
  }
});

// ------------------------------------
// GET PROFILE ROUTE (Sequelize Version)
// ------------------------------------
app.get('/get-profile', async (req, res) => {
  const userEmail = req.query.email;

  if (!userEmail) {
    return res.status(400).json({ error: "Email parameter is required to sync profile data." });
  }

  try {
    // Queries database safely using your Sequelize User model config
    const user = await User.findOne({
      where: { email: userEmail },
      attributes: ['full_name', 'username', 'email', 'phone', 'bio', 'department', 'gender'] // Safe extraction whitelist
    });

    if (!user) {
      return res.status(404).json({ error: "No user profile found matching this email." });
    }

    // Return user object context safely
    return res.json(user);
  } catch (err) {
    console.error("Database extraction error:", err.message);
    return res.status(500).json({ error: "Internal server database error: " + err.message });
  }
});

// ------------------------------------
// FORGOT PASSWORD - Generate & Send OTP (Sequelize Version)
// ------------------------------------
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Sequelize: Find user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'Email not found' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Expiry time (10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Sequelize: Update user with OTP and Expiry
    await user.update({
      reset_otp: otp,
      reset_otp_expires_at: expiresAt
    });

    // Send OTP email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP is: ${otp}`
    });

    res.json({ message: 'OTP sent successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ------------------------------------
// VERIFY OTP ROUTE (Sequelize Version)
// ------------------------------------
app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  try {
    // Sequelize: Find user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check OTP (using != to allow string/number comparison)
    if (user.reset_otp != otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Check expiry
    if (new Date() > new Date(user.reset_otp_expires_at)) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    res.json({ message: 'OTP verified successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ------------------------------------
// RESET PASSWORD - Verify OTP & Update (Sequelize Version)
// ------------------------------------
app.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    // Sequelize: Find user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // OTP check
    if (user.reset_otp != otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Expiry check
    if (new Date() > new Date(user.reset_otp_expires_at)) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Sequelize: Update user and wipe OTP fields clean
    await user.update({
      password_hash: hashedPassword,
      reset_otp: null,
      reset_otp_expires_at: null
    });

     res.json({ message: 'Password reset successful' }); 
     
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ------------------------------------
// ADD COURSE
// ------------------------------------
app.post('/courses', authenticateToken, upload.single('thumbnail'), async (req, res) => {
  const { title, description, semester, academic_year, is_published } = req.body;
  const imageUrl = req.file ? req.file.path : null;

  try {
    const lecturerId = req.user.id;

    // Sequelize: Create the course
    const newCourse = await Course.create({
      title,
      description,
      semester,
      academic_year,
      is_published,
      lecturer_id: lecturerId,
      image_url: imageUrl
    });

    res.status(201).json(newCourse);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ------------------------------------
// GET ALL COURSES (With Lecturer Email)
// ------------------------------------
app.get('/courses', authenticateToken, async (req, res) => {
  try {
    // Sequelize: Find all courses and JOIN the User table to get the email
    const courses = await Course.findAll({
      include: [{
        model: User,
        attributes: ['email'] // Only pull the email, we don't need their password hash!
      }]
    });

    // Format the data exactly how your React Native frontend expects it
    const formattedCourses = courses.map(course => {
      const courseData = course.toJSON();
      courseData.lecturer_email = course.User ? course.User.email : null;
      return courseData;
    });

    res.json(formattedCourses);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ------------------------------------
// GET COURSES FOR A SPECIFIC LECTURER
// ------------------------------------
app.get('/lecturer/courses', authenticateToken, async (req, res) => {
  try {
    const lecturerId = req.user ? req.user.id : 1; 

    const courses = await Course.findAll({
      where: { lecturer_id: lecturerId },
      order: [['id', 'DESC']] // Shows newest courses first
    });

    res.json(courses);
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


  if (!id || id === 'undefined') {
    return res.status(400).json({ error: 'Invalid Course ID' });
  }

  try {
    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Grab the materials for this specific course
    const materials = await CourseMaterial.findAll({
      where: { course_id: id },
      order: [['createdAt', 'ASC']]
    });

    res.json({
      ...course.toJSON(),
      materials: materials
    });  

  } catch (err) {
    console.error("DATABASE QUERY ERROR:", err); 
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});