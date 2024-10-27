// database/models/CourseTerm.ts

import { DataTypes, Model } from 'sequelize';
import { sequelizeInstance } from '../sequelizeInstance';

// Ref: https://sequelize.org/docs/v6/core-concepts/model-basics/
class CourseTerm extends Model {}

/**
 * A CourseTerm refers to the season (e.g., spring, summer, fall, winter) and the year that a course is offered
 *
 * For example, a sample a CourseTerm record looks like this:
 *
 * {
 *   course_term_id: 1,
 *   season: "spring",
 *   year: 2010
 * }
 *
 */

CourseTerm.init(
  {
    course_term_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    season: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: 'course_terms',
  }
);

export default CourseTerm;
