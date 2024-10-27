// database/models/AdminActionType.ts

import { DataTypes, Model } from 'sequelize';
import { sequelizeInstance } from '../sequelizeInstance';

// Ref: https://sequelize.org/docs/v6/core-concepts/model-basics/
class AdminActionType extends Model {}

/**
 * An AdminActionType belongs to an AdminAction.
 * An AdminActionType refers to whether an admin approves or denies a review.
 *
 * These are the only 2 AdminActionTypes that will be re-used:
 *
 * {action_type_id : 1, action_type_name: "rejected"}
 * {action_type_id : 2, action_type_name: "accepted"}
 **/

AdminActionType.init(
  {
    admin_action_type_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    admin_action_type_name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: 'admin_action_types',
  }
);

export default AdminActionType;
