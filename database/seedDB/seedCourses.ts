// database/seedDB/seedCourses.ts

import Course from '../models/Course';

const seedCourse = async () => {
  await Course.bulkCreate([
    {
      course_code: 'WEB222',
      course_detail_id: 1,
      course_term_id: 1,
      course_section: 'NAA',
      course_delivery_format_id: 1,
    },
    {
      course_code: 'WEB222',
      course_detail_id: 1,
      course_term_id: 2,
      course_section: 'NAA',
      course_delivery_format_id: 1,
    },
    {
      course_code: 'WEB222',
      course_detail_id: 2,
      course_term_id: 2,
      course_section: 'NAA',
      course_delivery_format_id: 1,
    },
  ]);
};

export { seedCourse as seedAdminActions };