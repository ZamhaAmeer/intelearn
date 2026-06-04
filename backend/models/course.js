const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const course = sequelize.define('course', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  semester: DataTypes.STRING,
  academic_year: DataTypes.STRING,
  is_published: DataTypes.BOOLEAN,
  lecturer_id: DataTypes.INTEGER,
  image_url: DataTypes.STRING
}, {
  tableName: 'courses',
  timestamps: true,
});

module.exports = course;