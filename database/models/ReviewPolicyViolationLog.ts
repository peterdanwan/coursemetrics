// database/models/ReviewPolicy.ts

import { DataTypes, Model } from 'sequelize';
import { sequelizeInstance } from '../sequelizeInstance';
import Policy from './Policy';
import Review from './Review';

// Ref: https://sequelize.org/docs/v6/core-concepts/model-basics/
class ReviewPolicyViolationLog extends Model {}

ReviewPolicyViolationLog.init(
  {
    review_policy_id: {
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
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: 'review_policy_violation_logs',
  }
);

export default ReviewPolicyViolationLog;
