// database/seedDB/seedReviewPolicyViolationLogs.ts

import ReviewPolicyViolationLog from '../models/ReviewPolicyViolationLog';

const seedReviewPolicyViolationLogs = async () => {
  await ReviewPolicyViolationLog.bulkCreate([
    {
      review_id: 1, // Assuming review ID 1 exists
      policy_id: 1, // Violated Review Submission Guidelines
    },
    {
      review_id: 1, // Review ID 1
      policy_id: 2, // Violated Content Accuracy Policy
    },
    {
      review_id: 2, // Assuming review ID 2 exists
      policy_id: 3, // Did not violate Spam and Promotional Content Policy
    },
    {
      review_id: 3, // Assuming review ID 3 exists
      policy_id: 4, // Did not violate Privacy Policy
    },
    {
      review_id: 4, // Assuming review ID 4 exists
      policy_id: 5, // Violated Consequences of Policy Violation
    },
    {
      review_id: 5, // Assuming review ID 5 exists
      policy_id: 1, // Violated Review Submission Guidelines
    },
  ]);
};

export { seedReviewPolicyViolationLogs };
