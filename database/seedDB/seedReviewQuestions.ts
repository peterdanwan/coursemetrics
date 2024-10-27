// database/seedDB/seedReviewQuestions.ts

import ReviewQuestion from '../models/ReviewQuestion';

const seedReviewQuestions = async () => {
  await ReviewQuestion.bulkCreate([
    { review_id: 1, question_id: 1 },
    { review_id: 1, question_id: 2 },
    { review_id: 1, question_id: 3 },
    { review_id: 2, question_id: 1 },
    { review_id: 2, question_id: 2 },
    { review_id: 2, question_id: 3 },
    { review_id: 3, question_id: 1 },
    { review_id: 3, question_id: 2 },
    { review_id: 3, question_id: 3 },
    { review_id: 4, question_id: 4 },
    { review_id: 4, question_id: 5 },
    { review_id: 4, question_id: 6 },
    { review_id: 5, question_id: 4 },
    { review_id: 5, question_id: 5 },
    { review_id: 5, question_id: 6 },
    { review_id: 6, question_id: 4 },
    { review_id: 6, question_id: 5 },
    { review_id: 6, question_id: 6 },
  ]);
};

export { seedReviewQuestions };
