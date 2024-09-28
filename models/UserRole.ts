// models/UserRole.ts

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/database';

class UserRole extends Model {}

UserRole.init(
  {
    role_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'user_roles',
    timestamps: false,
  }
);

export default UserRole;
