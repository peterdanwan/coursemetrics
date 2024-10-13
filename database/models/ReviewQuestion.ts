// database/models/ReviewQuestion.ts

import { DataTypes, Model } from 'sequelize';
import { sequelizeInstance } from '../sequelizeInstance';

import Review from './Review';
import Question from './Question';

// Ref: https://sequelize.org/docs/v6/core-concepts/model-basics/
class ReviewQuestion extends Model {}

/**
 * A ReviewQuestion contains the verbiage from the Question model.$
 * Each ReviewQuestion is tied to a specific Review through the reviewID.
 */
ReviewQuestion.init(
  {
    review_question_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    review_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Review,
        key: 'review_id',
      },
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Question,
        key: 'question_id',
      },
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: 'review_questions',
  }
);

// Associations
// Ref: https://sequelize.org/docs/v7/category/associations/

// TODO: Add associations for Review and Question

export default ReviewQuestion;
