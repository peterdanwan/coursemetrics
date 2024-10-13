// database/seedDB/index.ts

import { seedUserRoles } from './seedUserRoles';
import { seedUserProfiles } from './seedUserProfiles';
import { seedUsers } from './seedUsers';
import { seedCourse } from './seedCourses';
import { seedCourseTerms } from './seedCourseTerms';
import { seedCourseDetails } from './seedCourseDetails';
import { seedCourseDeliveryFormats } from './seedCourseDeliveryFormats';
// import { seedProfessors } from './seedProfessors';
// import { seedCourses } from './seedCourses';

const seedDB = async () => {
  await seedUserRoles();
  await seedUsers();
  await seedUserProfiles();
  await seedCourseDetails();
  await seedCourseTerms();
  await seedCourseDeliveryFormats();
  await seedCourse();
};

export { seedDB };
