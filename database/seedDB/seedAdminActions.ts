// database/seedDB/seedAdminActions.ts

import AdminAction from '../models/AdminAction';

const seedAdminActions = async () => {
  await AdminAction.bulkCreate([
    {
      review_id: 1,
      admin_id: 1,
      action_type_id: 1,
    },
    {
      review_id: 2,
      admin_id: 2,
      action_type_id: 2,
    },
  ]);
};

export { seedAdminActions };
