const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const enrollment = sequelize.define('enrollment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },