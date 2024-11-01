// database/seedDB/seedProfessorCourses.ts

import ProfessorCourse from '../models/ProfessorCourse';

const seedProfessorCourses = async () => {
  await ProfessorCourse.bulkCreate([
    {
      professor_id: 1,
      course_id: 1,
      term_id: 1,
    },
    {
      professor_id: 2,
      course_id: 2,
      term_id: 1,
    },
    {
      professor_id: 1,
      course_id: 3,
      term_id: 2,
    },
    {
      professor_id: 3,
      course_id: 4,
      term_id: 2,
    },
    {
      professor_id: 2,
      course_id: 4,
      term_id: 2,
    },
    {
      professor_id: 2,
      course_id: 5,
      term_id: 3,
    },
  ]);
};

export { seedProfessorCourses };
