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