// database/seedDB/seedReviewTypes.ts

import ReviewType from '../models/ReviewType';

const seedReviewTypes = async () => {
  await ReviewType.bulkCreate([
    {
      review_type_id: 1,
      review_type_name: 'course',
    },
    {
      review_type_id: 2,
      review_type_name: 'professor',
    },
  ]);
};

export { seedReviewTypes };
