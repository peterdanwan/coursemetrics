import Course from './Course';
import CourseDetail from './CourseDetail';
import CourseDeliveryFormat from './CourseDeliveryFormat';
import CourseTerm from './CourseTerm';
import UserProfile from './UserProfile';
import User from './User';

// Ref: https://sequelize.org/docs/v7/category/associations/
const setupAssociations = () => {
  // Course-related associations
  Course.belongsTo(CourseDetail, { foreignKey: 'course_detail_id' });
  Course.belongsTo(CourseTerm, { foreignKey: 'course_term_id' });
  Course.belongsTo(CourseDeliveryFormat, { foreignKey: 'course_delivery_format_id' });
  CourseDetail.hasMany(Course, { foreignKey: 'course_detail_id' });
  CourseTerm.hasMany(Course, { foreignKey: 'course_term_id' });
  CourseDeliveryFormat.hasMany(Course, { foreignKey: 'course_delivery_format_id' });
  UserProfile.belongsTo(User, { foreignKey: 'user_id' });
  User.hasOne(UserProfile, { foreignKey: 'user_id' });
};

export { setupAssociations };
