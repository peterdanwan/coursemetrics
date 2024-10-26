// database/seedDB/seedCourseTerms.ts

import CourseTerm from '../models/CourseTerm';

const seedCourseTerms = async () => {
  await CourseTerm.bulkCreate([
    {
      season: 'Fall',
      year: 2023,
    },
    {
      season: 'Spring',
      year: 2024,
    },
    {
      season: 'Winter',
      year: 2024,
    },
    {
      season: 'Summer',
      year: 2024,
    },
  ]);
};

export { seedCourseTerms };
