// database/seedDB/seedUserRoles.ts
import UserRole from '../models/UserRole';

const seedUserRoles = async () => {
  await UserRole.bulkCreate([
    {
      role_name: 'admin',
    },
    {
      role_name: 'student',
    },
  ]);
};

export { seedUserRoles };
