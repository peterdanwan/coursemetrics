// models/UserProfile.ts

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/database';
import User from './User';

// Ref: https://sequelize.org/docs/v6/core-concepts/model-basics/
class UserProfile extends Model {}

/**
 *
 *
 */

UserProfile.init(
  {
    profile_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'user_id',
      },
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'user_profiles',
  }
);

// Associations
// Ref: https://sequelize.org/docs/v7/category/associations/
UserProfile.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(UserProfile, { foreignKey: 'user_id' });

export default UserProfile;
