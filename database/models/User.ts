// database/models/User.ts

import { DataTypes, Model } from 'sequelize';
import { sequelizeInstance } from '../sequelizeInstance';
import UserRole from './UserRole';

// Ref: https://sequelize.org/docs/v6/core-concepts/model-basics/
class User extends Model {}

User.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    full_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
      allowNull: true,
      references: {
        model: UserRole,
        key: 'role_id',
      },
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: 'users',
  }
);

// Associations
// Ref: https://sequelize.org/docs/v7/category/associations/

// TODO: Add associations

export default User;
