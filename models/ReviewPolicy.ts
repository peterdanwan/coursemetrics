// models/ReviewPolicy.ts

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/database';
import Policy from './Policy';
import Review from './Review';

// Ref: https://sequelize.org/docs/v6/core-concepts/model-basics/
class ReviewPolicy extends Model {}

ReviewPolicy.init(
  {
    review_policy: {
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
    policy_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Policy,
        key: 'policy_id',
      },
      field: 'policy_id',
    },
    policy_violated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  { sequelize, tableName: 'review_policies' }
);

// Associations
// Ref: https://sequelize.org/docs/v7/category/associations/

// TODO: add associations

export default ReviewPolicy;
