// database/models/Policy.ts

import { DataTypes, Model } from 'sequelize';
import { sequelizeInstance } from '../sequelizeInstance';

// Ref: https://sequelize.org/docs/v6/core-concepts/model-basics/
class Policy extends Model {}

Policy.init(
  {
    policy_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    policy_name: { type: DataTypes.TEXT, allowNull: false },
    policy_description: { type: DataTypes.TEXT, allowNull: false },
  },
  {
    sequelize: sequelizeInstance,
    tableName: 'policies',
  }
);

export default Policy;
