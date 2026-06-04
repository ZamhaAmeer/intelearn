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