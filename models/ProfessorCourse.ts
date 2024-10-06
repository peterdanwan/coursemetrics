// models/ProfessorCourse.ts

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/database';
import Professor from './Professor';
import Course from './Course';

// Ref: https://sequelize.org/docs/v6/core-concepts/model-basics/
class ProfessorCourse extends Model {}

ProfessorCourse.init(
  {
    professor_course_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    professor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Professor,
        key: 'professor_id',
      },
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Course,
        key: 'course_id',
      },
    },
  },
  {
    sequelize,
    tableName: 'professor_course',
    timestamps: false,
  }
);

// Associations
// Ref: https://sequelize.org/docs/v7/category/associations/

// TODO: Add associations

export default ProfessorCourse;
