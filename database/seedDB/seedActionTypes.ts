// database/seedDB/seedAdminActionTypes.ts

import ActionType from '../models/ActionType';

const seedAdminActionTypes = async () => {
  await ActionType.bulkCreate([
    {
      action_type_id: 1,
      action_type_name: 'rejected',
    },
    {
      action_type_id: 2,
      action_type_name: 'accepted',
    },
  ]);
};

export { seedAdminActionTypes };
