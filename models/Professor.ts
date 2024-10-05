// models/Professor.ts

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/database';

// Ref: https://sequelize.org/docs/v6/core-concepts/model-basics/
class Professor extends Model {}

Professor.init(
  {
    professor_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'professors',
    timestamps: false,
  }
);

export default Professor;
