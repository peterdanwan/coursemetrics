// database/models/Review.ts

import { DataTypes, Model } from 'sequelize';
import { sequelizeInstance } from '../sequelizeInstance';
import ReviewType from './ReviewType';
import ReviewStatus from './ReviewStatus';
import ProfessorCourse from './ProfessorCourse';
import User from './User';

class Review extends Model {}

/**
 *
 *
 */

Review.init(
  {
    review_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    review_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ReviewType,
        key: 'review_type_id',
      },
    },
    review_status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ReviewStatus,
        key: 'review_status_id',
      },
    },
    professor_course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ProfessorCourse,
        key: 'professor_course_id',
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'user_id',
      },
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: 'reviews',
  }
);

export default Review;
