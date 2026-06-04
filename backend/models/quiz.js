const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const quiz = sequelize.define('quiz', {
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  }