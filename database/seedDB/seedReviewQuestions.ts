// database/seedDB/seedReviewQuestions.ts

import ReviewQuestion from '../models/ReviewQuestion';

const seedReviewQuestions = async () => {
  await ReviewQuestion.bulkCreate([
    // Reviews for courses:
    { review_id: 1, question_id: 1 },
    { review_id: 1, question_id: 2 },
    { review_id: 1, question_id: 3 },
    { review_id: 1, question_id: 4 },
    { review_id: 1, question_id: 5 },
    { review_id: 1, question_id: 6 },
    { review_id: 1, question_id: 7 },
    { review_id: 1, question_id: 8 },
    { review_id: 1, question_id: 9 },
    { review_id: 1, question_id: 10 },

    { review_id: 2, question_id: 1 },
    { review_id: 2, question_id: 2 },
    { review_id: 2, question_id: 3 },
    { review_id: 2, question_id: 4 },
    { review_id: 2, question_id: 5 },
    { review_id: 2, question_id: 6 },
    { review_id: 2, question_id: 7 },
    { review_id: 2, question_id: 8 },
    { review_id: 2, question_id: 9 },
    { review_id: 2, question_id: 10 },

    { review_id: 3, question_id: 1 },
    { review_id: 3, question_id: 2 },
    { review_id: 3, question_id: 3 },
    { review_id: 3, question_id: 4 },
    { review_id: 3, question_id: 5 },
    { review_id: 3, question_id: 6 },
    { review_id: 3, question_id: 7 },
    { review_id: 3, question_id: 8 },
    { review_id: 3, question_id: 9 },
    { review_id: 3, question_id: 10 },

    // Reviews for professors
    { review_id: 4, question_id: 11 },
    { review_id: 4, question_id: 12 },
    { review_id: 4, question_id: 13 },
    { review_id: 4, question_id: 14 },
    { review_id: 4, question_id: 15 },
    { review_id: 4, question_id: 16 },
    { review_id: 4, question_id: 17 },
    { review_id: 4, question_id: 18 },
    { review_id: 4, question_id: 19 },
    { review_id: 4, question_id: 20 },
    { review_id: 4, question_id: 21 },

    { review_id: 5, question_id: 11 },
    { review_id: 5, question_id: 12 },
    { review_id: 5, question_id: 13 },
    { review_id: 5, question_id: 14 },
    { review_id: 5, question_id: 15 },
    { review_id: 5, question_id: 16 },
    { review_id: 5, question_id: 17 },
    { review_id: 5, question_id: 18 },
    { review_id: 5, question_id: 19 },
    { review_id: 5, question_id: 20 },
    { review_id: 5, question_id: 21 },

    { review_id: 6, question_id: 11 },
    { review_id: 6, question_id: 12 },
    { review_id: 6, question_id: 13 },
    { review_id: 6, question_id: 14 },
    { review_id: 6, question_id: 15 },
    { review_id: 6, question_id: 16 },
    { review_id: 6, question_id: 17 },
    { review_id: 6, question_id: 18 },
    { review_id: 6, question_id: 19 },
    { review_id: 6, question_id: 20 },
    { review_id: 6, question_id: 21 },
  ]);
};

export { seedReviewQuestions };
