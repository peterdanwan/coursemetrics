// database/seedDB/seedReviews.ts

import Review from '../models/Review';

const seedReviews = async () => {
  await Review.bulkCreate([
    {
      review_type_id: 1,
      review_status_id: 2,
      professor_course_id: 1,
      user_id: 1,
      rating: 5,
      title: 'Great Learning Experience',
      comment: 'Fantastic course! I learned a lot and enjoyed the hands-on projects.',
      grade: 'A',
    },
    {
      review_type_id: 1,
      review_status_id: 4,
      professor_course_id: 2,
      user_id: 2,
      rating: 4,
      title: 'Solid Course with Room for Improvement',
      comment: 'Good course structure, but it could use more practical examples.',
      grade: 'B+',
    },
    {
      review_type_id: 1,
      review_status_id: 2,
      professor_course_id: 3,
      user_id: 1,
      rating: 3,
      title: 'Fast-Paced but Relevant',
      comment: 'The content was relevant, but the pace was too fast.',
      grade: 'B',
    },
    {
      review_type_id: 2,
      review_status_id: 2,
      professor_course_id: 4,
      user_id: 2,
      rating: 5,
      title: 'Outstanding Professor',
      comment: 'Excellent instructor! Very engaging and knowledgeable.',
      grade: null,
    },
    {
      review_type_id: 2,
      review_status_id: 3,
      professor_course_id: 5,
      user_id: 1,
      rating: 4,
      title: 'Good Professor with Limited Availability',
      comment: 'Great feedback on assignments, but could be more available for questions.',
      grade: null,
    },
    {
      review_type_id: 2,
      review_status_id: 1,
      professor_course_id: 3,
      user_id: 2,
      rating: 2,
      title: 'Communication Issues',
      comment: 'The professor was knowledgeable but had poor communication skills.',
      grade: null,
    },
  ]);
};

export { seedReviews };
