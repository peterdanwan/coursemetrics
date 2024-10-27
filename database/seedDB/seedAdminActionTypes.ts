// database/seedDB/seedAdminActionTypes.ts

import AdminActionType from '../models/AdminActionType';

const seedAdminActionTypes = async () => {
  await AdminActionType.bulkCreate([
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
