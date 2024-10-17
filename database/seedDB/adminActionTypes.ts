// database/seedDB/seedActionTypes.ts

import ActionType from '../models/ActionType';

const seedActionTypes = async () => {
  await ActionType.bulkCreate([
    {
      action_type_name: 'rejected',
    },
    {
      action_type_name: 'accepted',
    },
  ]);
};

export { seedActionTypes };
