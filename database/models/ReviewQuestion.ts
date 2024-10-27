// database/models/ReviewQuestion.ts

import { DataTypes, Model } from 'sequelize';
import { sequelizeInstance } from '../sequelizeInstance';

import Review from './Review';
import Question from './Question';

// Ref: https://sequelize.org/docs/v6/core-concepts/model-basics/
class ReviewQuestion extends Model {}

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

export default ReviewQuestion;
