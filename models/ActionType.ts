// models/ActionType.ts

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/database';

// Ref: https://sequelize.org/docs/v6/core-concepts/model-basics/
class ActionType extends Model {}

ActionType.init(
  {
    action_type_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Approved | Rejected
    action_type_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  { sequelize, tableName: 'action_types' }
);

export default ActionType;
