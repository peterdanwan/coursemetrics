// database/seedDB/seedReviewAnswers.ts

import ReviewAnswer from '../models/ReviewAnswer';

const seedReviewAnswers = async () => {
  await ReviewAnswer.bulkCreate([
    {
      review_question_id: 1,
      answer: 'Yes, the course content was very relevant and met my learning goals perfectly.',
    },
    {
      review_question_id: 2,
      answer: 'The materials were engaging and kept me interested throughout the course.',
    },
    {
      review_question_id: 3,
      answer: 'I would definitely recommend this course; it was well-structured and informative.',
    },
    {
      review_question_id: 4,
      answer: 'The content was relevant, but some topics felt rushed.',
    },
    {
      review_question_id: 5,
      answer: '3',
    },
    {
      review_question_id: 6,
      answer: '4',
    },

    {
      review_question_id: 7,
      answer: '1',
    },
    {
      review_question_id: 8,
      answer: '3',
    },
    {
      review_question_id: 9,
      answer: '2',
    },

    {
      review_question_id: 10,
      answer: '4',
    },
    {
      review_question_id: 11,
      answer: 'Yes, the feedback was constructive and helped improve my work.',
    },
    {
      review_question_id: 12,
      answer: 'The instructor could incorporate more real-life examples to enhance understanding.',
    },

    {
      review_question_id: 13,
      answer: 'The instructor was somewhat approachable, but office hours were limited.',
    },
    {
      review_question_id: 14,
      answer: 'Feedback was mostly positive but lacked detailed suggestions for improvement.',
    },
    {
      review_question_id: 15,
      answer: '4',
    },

    {
      review_question_id: 16,
      answer: '1',
    },
    {
      review_question_id: 17,
      answer: '2',
    },
    {
      review_question_id: 18,
      answer: '3',
    },
  ]);
};

export { seedReviewAnswers };
