// database/models/ReviewAnswer.ts

import { DataTypes, Model } from 'sequelize';
import { sequelizeInstance } from '../sequelizeInstance';
import ReviewQuestion from './ReviewQuestion';

// Ref: https://sequelize.org/docs/v6/core-concepts/model-basics/
class ReviewAnswer extends Model {}

ReviewAnswer.init(
  {
    review_answer_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    review_question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ReviewQuestion,
        key: 'review_question_id',
      },
    },
    answer: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: 'review_answers',
  }
);

export default ReviewAnswer;
