// database/seedDB/seedQuestions.ts

import Question from '../models/Question';

const seedQuestions = async () => {
  await Question.bulkCreate([
    {
      question_text: 'Was the course content relevant and applicable to your learning goals?',
      review_type_id: 1,
    },
    {
      question_text: 'How engaging were the course materials (lectures, readings, etc.)?',
      review_type_id: 1,
    },
    {
      question_text: 'Would you recommend this course to other students? Why or why not?',
      review_type_id: 1,
    },
    {
      question_text: 'How approachable was the instructor for questions and support?',
      review_type_id: 2,
    },
    {
      question_text: 'Did the instructor provide constructive feedback on assignments?',
      review_type_id: 2,
    },
    {
      question_text: 'What could the instructor do to improve their teaching methods?',
      review_type_id: 2,
    },
  ]);
};

export { seedQuestions };
