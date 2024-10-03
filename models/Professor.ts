// models/Professor.ts

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/database';
import UserRole from './UserRole';

class Professor extends Model {}

Professor.init(
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
    timestamps: false,
  }
);

export default Professor;
