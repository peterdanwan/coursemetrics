// database/seedDB/seedCourseDetails.ts

import CourseDetail from '../models/CourseDetail';

const seedCourseDetails = async () => {
  await CourseDetail.bulkCreate([
    {
      course_name: 'Introduction to Web Programming',
      course_description: 'Learn HTML, JS, and CSS to build modern web applications.',
    },
    {
      course_name: 'Advanced Web Development',
      course_description: 'Master advanced JavaScript techniques and frameworks.',
    },
    {
      course_name: 'Introduction to C Programming',
      course_description:
        'Learn the basics of the C Programming language and how to compile a program.',
    },
    {
      course_name: 'Cloud Computing with AWS',
      course_description: 'Learn how to use AWS web services and Dockerize applications.',
    },
  ]);
};

export { seedCourseDetails };
