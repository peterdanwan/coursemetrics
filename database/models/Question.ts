// database/models/Question.ts

import { DataTypes, Model } from 'sequelize';
import { sequelizeInstance } from '../sequelizeInstance';
import ReviewType from './ReviewType';

// Ref: https://sequelize.org/docs/v6/core-concepts/model-basics/
class Question extends Model {}

/**
 * These are the repeated questions we will ask for EACH review
 *
 * E.g.,
 * - What are your thoughts on this course?
 * - What type of skills did your learn?
 *
 * The reviewTypeID indicates if this question's text is for a professor review or course review.
 */
Question.init(
  {
    question_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    question_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    review_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ReviewType,
        key: 'review_type_id',
      },
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: 'questions',
  }
);

// Associations
// Ref: https://sequelize.org/docs/v7/category/associations/

// TODO: Add associations

export default Question;
