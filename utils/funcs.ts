export const calculateAverageRating = (reviews: any): number => {
  const validRatings = reviews.filter((review: any) => review.is_rating);

  if (validRatings.length === 0) {
    return 0;
  }

  const totalRating = validRatings.reduce(
    (sum: number, review: any) => sum + Number(review.answer),
    0
  );

  const averageRating = totalRating / validRatings.length;
  return Math.round(averageRating);
};

export const getReviewResponses = (data: any): string[] => {
  const reviews: string[] = [];

  reviews.push(data.commentTitle);
  reviews.push(data.comment);

  data.questions.forEach((question: any) => {
    if (!question.is_rating) {
      reviews.push(question.answer);
    }
  });

  return reviews;
};

const shuffleArray = <T>(array: T[]): T[] => {
  return array.sort(() => Math.random() - 0.5);
};

export const getFirstFiveComments = (reviews: any[]): string[] => {
  if (reviews.length <= 5) {
    return reviews.map((review: any) => review.comment).slice(0, 5);
  } else {
    const shuffledReviews = shuffleArray(reviews);
    return shuffledReviews.map((review: any) => review.comment).slice(0, 5);
  }
};
