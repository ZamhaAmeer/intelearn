const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const quiz = sequelize.define('quiz', {