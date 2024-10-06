// models/Policy.ts

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/database';

// Ref: https://sequelize.org/docs/v6/core-concepts/model-basics/
class Policy extends Model {}

Policy.init(
  {
    policy_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    policy_name: { type: DataTypes.STRING, allowNull: false },
    policy_description: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, tableName: 'policies', timestamps: false }
);

export default Policy;
