const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const enrollment = sequelize.define('enrollment', {
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
  }
}, {
  tableName: 'enrollments',
  timestamps: true,
});

module.exports = enrollment;