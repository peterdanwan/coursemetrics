// models/AdminAction.ts

import { DataTypes, Model } from 'sequelize';
import ActionType from './ActionType';
import Review from './Review';
import User from './User';
import { sequelizeInstance } from '../sequelizeInstance';

// Ref: https://sequelize.org/docs/v6/core-concepts/model-basics/
class AdminAction extends Model {}

/**
 * An AdminAction is performed on a Review with a review_status_id of "pending".
 * An AdminAction determines whether a "pending" review is posted or not.
 *
 * A given AdminAction belongs to one User, with the role_id of `1` for `admin`. (role_id of 2 is `student`)
 *
 * One can determine the "type" of AdminAction through the ActionType.
 * The ActionType indicates whether the review was accepted or rejected.
 *
 * A sample AdminAction record would look like this:
 *
 * {
 *  admin_action_id:  23
 *  review_id: 2 // -> retrieve data like this:
 *  admin_id:
 *  action_type_id:
 *  action_date:
 * }
 *
 */

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
  {
    sequelize: sequelizeInstance,
    tableName: 'admin_actions',
  }
);

// Associations
// Ref: https://sequelize.org/docs/v7/category/associations/

// TODO: Add associations for Review and Question

export default AdminAction;
