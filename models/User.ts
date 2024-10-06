import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/database';
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
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: UserRole,
        key: 'role_id',
      },
    },
  },
  {
    sequelize,
    tableName: 'users',
  }
);

// Associations
// Ref: https://sequelize.org/docs/v7/category/associations/

// TODO: Add associations

export default User;
