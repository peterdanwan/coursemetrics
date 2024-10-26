// database/models/CourseDetail.ts

import { DataTypes, Model } from 'sequelize';
import { sequelizeInstance } from '../sequelizeInstance';
import Course from './Course';

// Ref: https://sequelize.org/docs/v6/core-concepts/model-basics/
class CourseDetail extends Model {}

/**
 * A CourseDetail belongs to a Course.
 *
 * A CourseDetail contains information about a Course's name and the Course's description.
 *
 * For example, a sample CourseDetail record looks like this:
 *
 * {
 *   course_detail_id: 123,
 *   course_name: "Introduction to C Programming",
 *   "Learn the basics of the C Programming language and how to compile a program."
 * }
 *
 */

CourseDetail.init(
  {
    course_detail_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    course_name: { type: DataTypes.TEXT, allowNull: false },
    course_description: { type: DataTypes.TEXT, allowNull: false },
  },
  {
    sequelize: sequelizeInstance,
    tableName: 'course_details',
  }
);

export default CourseDetail;
