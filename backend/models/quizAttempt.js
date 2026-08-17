// models/quizAttempt.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const quizAttempt = sequelize.define('quizAttempt', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quiz_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false // e.g., 80 (Out of 100)
  },
  answers_snapshot: {
    type: DataTypes.JSONB, // Stores key-value pairings of selections made for review screens
    allowNull: true
  }
}, {
  tableName: 'quiz_attempts',
  timestamps: true,
});

module.exports = quizAttempt;