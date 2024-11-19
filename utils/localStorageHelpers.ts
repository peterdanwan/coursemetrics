// utils/localStorageHelpers.ts
export const getBookmarkedReviews = (): number[] => {
  return JSON.parse(localStorage.getItem('bookmarkedReviews') || '[]');
};

export const isReviewBookmarked = (reviewId: number): boolean => {
  const bookmarkedReviews = getBookmarkedReviews();
  return bookmarkedReviews.includes(reviewId);
};

export const toggleReviewBookmark = (reviewId: number): boolean => {
  const bookmarkedReviews = getBookmarkedReviews();
  const isBookmarked = bookmarkedReviews.includes(reviewId);

  const updatedBookmarks = isBookmarked
    ? bookmarkedReviews.filter((id) => id !== reviewId)
    : [...bookmarkedReviews, reviewId];

  localStorage.setItem('bookmarkedReviews', JSON.stringify(updatedBookmarks));
  return !isBookmarked;
};
