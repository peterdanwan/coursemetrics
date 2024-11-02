// database/seedDB/seedQuestions.ts

import Question from '../models/Question';

const seedQuestions = async () => {
  await Question.bulkCreate([
    // review_type_id: 1 == course review questions
    {
      question_text: 'Was the course content relevant and applicable to your learning goals?',
      review_type_id: 1,
      is_rating: false,
    },
    {
      question_text: 'How engaging were the course materials (lectures, readings, etc.)?',
      review_type_id: 1,
      is_rating: false,
    },
    {
      question_text: 'What problems did you face and how did you solve them (if applicable)?',
      review_type_id: 1,
      is_rating: false,
    },
    {
      question_text: 'What are your thoughts on the course load and difficulty?',
      review_type_id: 1,
      is_rating: false,
    },
    {
      question_text: 'Difficulty',
      review_type_id: 1,
      is_rating: true,
    },
    {
      question_text: 'Course Structure',
      review_type_id: 1,
      is_rating: true,
    },
    {
      question_text: 'Course Load',
      review_type_id: 1,
      is_rating: true,
    },
    {
      question_text: 'Evaluation Fairness',
      review_type_id: 1,
      is_rating: true,
    },
    {
      question_text: 'Content Quality',
      review_type_id: 1,
      is_rating: true,
    },
    {
      question_text: 'Material Relevance',
      review_type_id: 1,
      is_rating: true,
    },
    // review_type_id: 2 == professor review questions
    {
      question_text: 'How approachable was the instructor for questions and support?',
      review_type_id: 2,
      is_rating: false,
    },
    {
      question_text: 'Did the instructor provide constructive feedback on assignments?',
      review_type_id: 2,
      is_rating: false,
    },
    {
      question_text: 'What could the instructor do to improve their teaching methods?',
      review_type_id: 2,
      is_rating: false,
    },
    {
      question_text:
        "Did you find the professor's communication during the lecture clear and easy to understand?",
      review_type_id: 2,
      is_rating: false,
    },
    {
      question_text: 'How engaging was the professor?',
      review_type_id: 2,
      is_rating: false,
    },
    {
      question_text: 'Difficulty',
      review_type_id: 2,
      is_rating: true,
    },
    {
      question_text: 'Knowledge',
      review_type_id: 2,
      is_rating: true,
    },
    {
      question_text: 'Responsiveness',
      review_type_id: 2,
      is_rating: true,
    },
    {
      question_text: 'Grading Fairness',
      review_type_id: 2,
      is_rating: true,
    },
    {
      question_text: 'Engagement',
      review_type_id: 2,
      is_rating: true,
    },
    {
      question_text: 'Clarity',
      review_type_id: 2,
      is_rating: true,
    },
  ]);
};

export { seedQuestions };
