// database/seedDB/seedUsers.ts

import User from '../models/User';

const seedUsers = async () => {
  await User.bulkCreate([
    {
      full_name: 'Jeremy Lee',
      email: 'jlee@gmail.com',
      role_id: 1,
    },
    {
      full_name: 'Peter Wan',
      email: 'pw@abg.com',
      role_id: 2,
    },
  ]);
};

export { seedUsers };
