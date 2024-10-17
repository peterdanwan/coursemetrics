// database/seedDB/seedReviews.ts

import Review from '../models/Review';

const seedReview = async () => {
  await Review.bulkCreate([
    {
      review_type_id: 1,
      review_status_id: 2,
      professor_course_id: 1,
      user_id: 1,
      rating: 5,
      comment: 'Fantastic course! I learned a lot and enjoyed the hands-on projects.',
    },
    {
      review_type_id: 1,
      review_status_id: 4,
      professor_course_id: 2,
      user_id: 2,
      rating: 4,
      comment: 'Good course structure, but it could use more practical examples.',
    },
    {
      review_type_id: 1,
      review_status_id: 2,
      professor_course_id: 3,
      user_id: 1,
      rating: 3,
      comment: 'The content was relevant, but the pace was too fast.',
    },
    {
      review_type_id: 2,
      review_status_id: 2,
      professor_course_id: 4,
      user_id: 2,
      rating: 5,
      comment: 'Excellent instructor! Very engaging and knowledgeable.',
    },
    {
      review_type_id: 2,
      review_status_id: 3,
      professor_course_id: 5,
      user_id: 1,
      rating: 4,
      comment: 'Great feedback on assignments, but could be more available for questions.',
    },
    {
      review_type_id: 2,
      review_status_id: 1,
      professor_course_id: 3,
      user_id: 2,
      rating: 2,
      comment: 'The professor was knowledgeable but had poor communication skills.',
    },
  ]);
};

export { seedReview };
