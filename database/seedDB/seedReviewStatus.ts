import ReviewStatus from '../models/ReviewStatus';

const seedReviewStatus = async () => {
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
    {
      review_status_id: 4,
      status: 'Under Review',
    },
  ]);
};

export { seedReviewStatus };
