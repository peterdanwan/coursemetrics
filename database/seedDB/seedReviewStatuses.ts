// database/seedDB/seedReviewStatuses.ts
import ReviewStatus from '../models/ReviewStatus';

const seedReviewStatuses = async () => {
  await ReviewStatus.bulkCreate([
    {
      review_status_id: 1,
      status: 'Pending',
    },
    {
      review_status_id: 2,
      status: 'Approved',
    },
    {
      review_status_id: 3,
      status: 'Rejected',
    },
  ]);
};

export { seedReviewStatuses };
