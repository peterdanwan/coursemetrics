// models/Course.ts

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/database';
import CourseDetail from './CourseDetail';

// Ref: https://sequelize.org/docs/v6/core-concepts/model-basics/
class Course extends Model {}

Course.init(
  {
    course_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    course_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    course_detail_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: CourseDetail,
        key: 'course_detail_id',
      },
    },
    // E.g., summer, fall, winter
    course_term: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    course_section: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // E.g., Online Async, Online Sync, In-person
    course_delivery_format: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize, tableName: 'courses', timestamps: false }
);

// Associations
// Ref: https://sequelize.org/docs/v7/category/associations/

// TODO: Add associations for Review and Question

export default Course;
