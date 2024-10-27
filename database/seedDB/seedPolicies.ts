// database/seedDB/seedPolicies.ts

import Policy from '../models/Policy';

const seedPolicies = async () => {
  await Policy.bulkCreate([
    {
      policy_name: 'Review Submission Guidelines',
      policy_description:
        'All reviews must adhere to respectful and constructive language. Any use of profanity, hate speech, or personal attacks will result in immediate rejection of the review.',
    },
    {
      policy_name: 'Content Accuracy Policy',
      policy_description:
        'Users are required to provide honest and accurate feedback. Fabricated or misleading reviews are strictly prohibited and will lead to account suspension.',
    },
    {
      policy_name: 'Spam and Promotional Content Policy',
      policy_description:
        'Reviews must focus on the course or instructor and should not include spam or promotional content. Reviews that are found to be promotional will be removed.',
    },
    {
      policy_name: 'Privacy Policy',
      policy_description:
        'Do not disclose personal information about others in your reviews. Respect the privacy of all users and instructors.',
    },
    {
      policy_name: 'Consequences of Policy Violation',
      policy_description:
        'Failure to adhere to these policies may result in the removal of your review, suspension of your account, or further actions as deemed necessary by the moderation team.',
    },
  ]);
};

export { seedPolicies };
