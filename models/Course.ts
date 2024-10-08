// models/Course.ts

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/database';
import CourseDetail from './CourseDetail';
import CourseTerm from './CourseTerm';

// Ref: https://sequelize.org/docs/v6/core-concepts/model-basics/
class Course extends Model {}

/**
 * A Course contains information of the course code, course term, course section, and course delivery format.
 *
 * A Course's course details, is stored via its course_detail_id.
 * A Course's CourseDetail contains the name of the course (e.g., Cloud Computing) and its description (e.g., learn to use AWS web services and Dockerize apps)
 *
 * A Course can be part of many ProfessorCourse records that explain what Professor taught a specific iteration of a course at a given time.
 *
 * A sample Course record would look like this:
 *
 * {
 *   course_id: 1,
 *   course_code: "WEB222",
 *   course_detail_id: 123123 // -> retrieve data like this:  { course_name: "Introduction to Web Programming", description: "Learn HTML, JS, and CSS... etc." }
 *   course_term_id: 123123 // -> retrieve data like this: {season: "Fall", year: 2024}
 *   course_section: "NAA"
 *   course_delivery_format_id: 1 // -> retrieve data like this: {name: "Online Async"} or {name: "Online Sync"} or {name: "In-person"} or {name: "Flexible"} or {name: "Hybrid"}
 * }
 *
 */

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
    course_term: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: CourseTerm,
        key: 'course_term_id',
      },
    },
    course_section: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    course_delivery_format: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize, tableName: 'courses' }
);

// Associations
// Ref: https://sequelize.org/docs/v7/category/associations/

// TODO: Add associations for Review and Question

export default Course;
