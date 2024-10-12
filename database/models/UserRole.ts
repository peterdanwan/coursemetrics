// models/UserRole.ts

import { DataTypes, Model } from 'sequelize';
import { sequelizeInstance } from '../sequelizeInstance';

// Ref: https://sequelize.org/docs/v6/core-concepts/model-basics/
class UserRole extends Model {}

/**
 * A UserRole represents the type of access a User has on the CourseMetrics web app.
 *
 * There are only 2 type of UserRole Records:
 *
 *  { role_id: 1, role_name: "admin"}
 *  { role_id: 2, role_name: "student"}
 *
 * This UserRole is important when determining if a User can conduct an AdminAction
 * where the User with the right role_id can determine if a review should be "accepted" or "rejected".
 */

UserRole.init(
  {
    role_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: 'user_roles',
  }
);

export default UserRole;
