// database/seedDB/seedReviewPolicyViolationLogs.ts

import ReviewPolicyViolationLog from '../models/ReviewPolicyViolationLog';

const seedReviewPolicyViolationLogs = async () => {
  await ReviewPolicyViolationLog.bulkCreate([
    {
      review_id: 1,
      policy_id: 1,
    },
    {
      review_id: 1,
      policy_id: 2,
    },
    {
      review_id: 2,
      policy_id: 3,
    },
  ]);
};

export { seedReviewPolicyViolationLogs };
