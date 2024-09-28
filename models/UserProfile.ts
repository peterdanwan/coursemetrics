// models/UserProfile.ts

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/database';
import User from './User';

class UserProfile extends Model {}

UserProfile.init(
  {
    profile_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'profile_id',
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'user_id',
      },
      field: 'user_id',
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'user_profiles',
    timestamps: false,
  }
);

// Associations
UserProfile.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(UserProfile, { foreignKey: 'user_id' });

export default UserProfile;
