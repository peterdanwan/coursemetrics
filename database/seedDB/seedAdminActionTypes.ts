// database/seedDB/seedAdminActionTypes.ts

import AdminActionType from '../models/AdminActionType';

const seedAdminActionTypes = async () => {
  await AdminActionType.bulkCreate([
    {
      admin_action_type_id: 1,
      admin_action_type_name: 'rejected',
    },
    {
      admin_action_type_id: 2,
      admin_action_type_name: 'accepted',
    },
  ]);
};

export { seedAdminActionTypes };
