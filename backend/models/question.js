const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const question = sequelize.define('question', {
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quiz_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  question: DataTypes.TEXT,
  option_a: DataTypes.STRING,
  option_b: DataTypes.STRING,
  option_c: DataTypes.STRING,
  option_d: DataTypes.STRING,
  correct_answer: DataTypes.STRING
}, {