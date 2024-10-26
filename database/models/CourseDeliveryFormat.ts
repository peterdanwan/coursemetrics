// database/models/CourseDeliveryFormat.ts

import { DataTypes, Model } from 'sequelize';
import { sequelizeInstance } from '../sequelizeInstance';

// Ref: https://sequelize.org/docs/v6/core-concepts/model-basics/
class CourseDeliveryFormat extends Model {}

/**
 * A CourseDeliveryFormat represents how a course is delivered, e.g., Online Async, Online Sync, In-person, etc.
 *
 * For example, a sample CourseDeliveryFormat record looks like this:
 *
 * {
 *   course_delivery_format_id: 1,
 *   name: "Online Async",
 *   description: "Courses that are delivered entirely online with asynchronous activities"
 * }
 */

CourseDeliveryFormat.init(
  {
    course_delivery_format_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    format: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: 'course_delivery_formats',
  }
);

export default CourseDeliveryFormat;
