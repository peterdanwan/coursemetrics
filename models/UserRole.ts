// models/UserRole.ts

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/database';

// Ref: https://sequelize.org/docs/v6/core-concepts/model-basics/
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
  }
);

export default UserRole;
