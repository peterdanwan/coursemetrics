// models/AdminAction.ts

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/database';
import ActionType from './ActionType';
import Review from './Review';
import User from './User';

// Ref: https://sequelize.org/docs/v6/core-concepts/model-basics/
class AdminAction extends Model {}

AdminAction.init(
  {
    admin_action_id: {
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
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'user_id',
      },
    },
    action_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ActionType,
        key: 'action_type_id',
      },
    },
    action_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { sequelize, tableName: 'admin_actions' }
);

// Associations
// Ref: https://sequelize.org/docs/v7/category/associations/

// TODO: Add associations for Review and Question

export default AdminAction;
