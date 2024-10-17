// database/seedDB/seedReviewHistories.ts

import ReviewHistory from '../models/ReviewHistory';

const seedReviewHistories = async () => {
  await ReviewHistory.bulkCreate([
    {
      review_id: 1,
      review_status_id: 1,
      changed_by: 1,
    },
    {
      review_id: 1,
      review_status_id: 2,
      changed_by: 1,
    },
    {
      review_id: 2,
      review_status_id: 1,
      changed_by: 1,
    },
    {
      review_id: 2,
      review_status_id: 3,
      changed_by: 1,
    },
    {
      review_id: 3,
      review_status_id: 1,
      changed_by: 1,
    },
    {
      review_id: 3,
      review_status_id: 2,
      changed_by: 1,
    },
    {
      review_id: 4,
      review_status_id: 3,
      changed_by: 1,
    },
    {
      review_id: 5,
      review_status_id: 1,
      changed_by: 1,
    },
    {
      review_id: 6,
      review_status_id: 2,
      changed_by: 1,
    },
  ]);
};

export { seedReviewHistories };
