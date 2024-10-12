// models/ActionType.ts

import { DataTypes, Model } from 'sequelize';
import { sequelizeInstance } from '../sequelizeInstance';

// Ref: https://sequelize.org/docs/v6/core-concepts/model-basics/
class ActionType extends Model {}

/**
 * An ActionType belongs to an AdminAction.
 * An ActionType refers to whether an admin approves or denies a review.
 *
 * These are the only 2 ActionTypes that will be re-used:
 *
 * {action_type_id : 1, action_type_name: "rejected"}
 * {action_type_id : 2, action_type_name: "accepted"}
 **/

ActionType.init(
  {
    action_type_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    action_type_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: 'action_types',
  }
);

export default ActionType;
