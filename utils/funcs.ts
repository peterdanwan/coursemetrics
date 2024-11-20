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

export const getFirstTenComments = (reviews: any[]): { comment: string; answers: string[] }[] => {
  const reviewsToReturn = reviews.length <= 10 ? reviews : shuffleArray(reviews).slice(0, 10);

  return reviewsToReturn.map((review: any) => {
    const comment = review.comment;
    const answers = review.dataValues.ReviewQuestions.flatMap((question: any) =>
      question.ReviewAnswers.map((answer: any) => answer.answer).filter((answer: string) =>
        isNaN(Number(answer))
      )
    );

    return { comment, answers };
  });
};

export const processReviews = (data: any) => {
  const result: any = {
    reviews: [],
    quickStats: {
      difficulty: 0,
      courseStructure: 0,
      courseLoad: 0,
      evaluationFairness: 0,
      contentQuality: 0,
      materialRelevance: 0,
      totalReviews: 0,
    },
  };

  data.forEach((review: any) => {
    const validReview = review.ReviewQuestions.some((reviewQuestion: any) => {
      return (
        reviewQuestion.ReviewAnswers.length > 0 && reviewQuestion.ReviewAnswers[0].answer !== null
      );
    });

    if (validReview) {
      result.quickStats.totalReviews++;
      result.reviews.push(review);

      review.ReviewQuestions.forEach((reviewQuestion: any) => {
        if (reviewQuestion.Question.is_rating && reviewQuestion.ReviewAnswers.length > 0) {
          const answer = reviewQuestion.ReviewAnswers[0].answer;
          const rating = parseFloat(answer);

          if (!isNaN(rating)) {
            switch (reviewQuestion.Question.question_text) {
              case 'Difficulty':
                result.quickStats.difficulty += rating;
                break;
              case 'Course Structure':
                result.quickStats.courseStructure += rating;
                break;
              case 'Course Load':
                result.quickStats.courseLoad += rating;
                break;
              case 'Evaluation Fairness':
                result.quickStats.evaluationFairness += rating;
                break;
              case 'Content Quality':
                result.quickStats.contentQuality += rating;
                break;
              case 'Material Relevance':
                result.quickStats.materialRelevance += rating;
                break;
              default:
                break;
            }
          }
        }
      });
    }
  });

  if (result.quickStats.totalReviews > 0) {
    result.quickStats.difficulty /= result.quickStats.totalReviews;
    result.quickStats.courseStructure /= result.quickStats.totalReviews;
    result.quickStats.courseLoad /= result.quickStats.totalReviews;
    result.quickStats.evaluationFairness /= result.quickStats.totalReviews;
    result.quickStats.contentQuality /= result.quickStats.totalReviews;
    result.quickStats.materialRelevance /= result.quickStats.totalReviews;
  }

  return result;
};
