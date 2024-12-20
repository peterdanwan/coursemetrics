// database/models/ReviewHistory.ts

import { DataTypes, Model } from 'sequelize';
import { sequelizeInstance } from '../sequelizeInstance';
import Review from './Review';
import ReviewStatus from './ReviewStatus';
import User from './User';

// Ref: https://sequelize.org/docs/v6/core-concepts/model-basics/
class ReviewHistory extends Model {}

ReviewHistory.init(
  {
    review_history_id: {
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
    review_status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ReviewStatus,
        key: 'review_status_id',
      },
    },
    changed_by: {
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
    tableName: 'review_history',
  }
);

export default ReviewHistory;
