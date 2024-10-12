// database/seedDB/index.ts
import { seedUserRoles } from './seedUserRoles';
import { seedUserProfiles } from './seedUserProfiles';
import { seedUsers } from './seedUsers';
// import { seedProfessors } from './seedProfessors';
// import { seedCourses } from './seedCourses';

const seedDB = async () => {
  await seedUserRoles();
  await seedUsers();
  await seedUserProfiles();
};

export { seedDB };
