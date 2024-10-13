// database/seedDB/seedUserProfiles.ts
import UserProfile from '../models/UserProfile';

const seedUserProfiles = async () => {
  await UserProfile.bulkCreate([{ user_id: 1 }, { user_id: 2 }]);
};

export { seedUserProfiles };
