// models/CourseDetail.ts

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/database';

// Ref: https://sequelize.org/docs/v6/core-concepts/model-basics/
class CourseDetail extends Model {}

CourseDetail.init(
  {
    course_detail_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    course_name: { type: DataTypes.STRING, allowNull: false },
    course_description: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, tableName: 'course_details', timestamps: false }
);

export default CourseDetail;
