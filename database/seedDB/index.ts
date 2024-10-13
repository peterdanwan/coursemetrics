// database/seedDB/index.ts

import { seedUserRoles } from './seedUserRoles';
import { seedUserProfiles } from './seedUserProfiles';
import { seedUsers } from './seedUsers';
import { seedCourse } from './seedCourses';
import { seedCourseTerms } from './seedCourseTerms';
import { seedCourseDetails } from './seedCourseDetails';
import { seedCourseDeliveryFormats } from './seedCourseDeliveryFormats';
import User from '../models/User';

const dataExists = async () => {
  try {
    const user = await User.findOne();
    return user ? true : false;
  } catch (error) {
    return false;
  }
};

const seedDB = async () => {
  let result = await dataExists();

  if (!result) {
    await seedUserRoles();
    await seedUsers();
    await seedUserProfiles();
    await seedCourseDetails();
    await seedCourseTerms();
    await seedCourseDeliveryFormats();
    await seedCourse();
  }
};

export { seedDB };
