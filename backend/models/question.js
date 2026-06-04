const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const question = sequelize.define('question', {