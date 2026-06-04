const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const courseMaterial = sequelize.define('courseMaterial', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  course_id: DataTypes.INTEGER,
  title: DataTypes.STRING,
  material_url: DataTypes.STRING
}, {
  tableName: 'course_materials',
  timestamps: true,
});

module.exports = courseMaterial;