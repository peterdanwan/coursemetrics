// database/models/ReviewStatus.ts

import { DataTypes, Model } from 'sequelize';
import { sequelizeInstance } from '../sequelizeInstance';

// Ref: https://sequelize.org/docs/v6/core-concepts/model-basics/
class ReviewStatus extends Model {}

ReviewStatus.init(
  {
    review_status_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: 'review_status',
  }
);

export default ReviewStatus;
