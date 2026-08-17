// models/aiChat.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const aiChat = sequelize.define('aiChat', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  bot_persona: {
    type: DataTypes.STRING, // "Maya" or "Dhruv"
    allowNull: false
  },
  sender: {
    type: DataTypes.STRING, // "Student" or "AI"
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'ai_chats',
  timestamps: true,
});

module.exports = aiChat;