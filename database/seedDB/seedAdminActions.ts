// database/seedDB/seedAdminActions.ts

import AdminAction from '../models/AdminAction';

const seedAdminActions = async () => {
  await AdminAction.bulkCreate([
    {
      review_id: 1,
      admin_id: 1,
      admin_action_type_id: 2,
    },
    {
      review_id: 2,
      admin_id: 1,
      admin_action_type_id: 2,
    },
    {
      review_id: 3,
      admin_id: 1,
      admin_action_type_id: 2,
    },
    {
      review_id: 4,
      admin_id: 1,
      admin_action_type_id: 1,
    },
    {
      review_id: 5,
      admin_id: 1,
      admin_action_type_id: 1,
    },
    {
      review_id: 6,
      admin_id: 1,
      admin_action_type_id: 1,
    },
  ]);
};

export { seedAdminActions };
