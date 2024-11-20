// app/user/bookmark/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { Box, Flex, Heading, Select, Spinner } from '@chakra-ui/react';
import { useFlexStyle } from '@/styles/styles';
import { apiFetcher } from '@/utils';
import BookmarkedReview from '@/components/BookmarkedReview';
import useSWR from 'swr';
import { getBookmarkedReviews, toggleReviewBookmark } from '@/utils/localStorageHelpers';

const Bookmark = () => {
  const flexStyle = useFlexStyle();
  const [bookmarkedReviewIds, setBookmarkedReviewIds] = useState<number[]>(getBookmarkedReviews());
  const [filterType, setFilterType] = useState<'course' | 'professor'>('course');

  const { data: reviewData, error: reviewError } = useSWR(`/api/reviews`, apiFetcher);
  console.log('Bookmark Review: ', reviewData);

  const handleToggleBookmark = (reviewId: number) => {
    toggleReviewBookmark(reviewId);
    setBookmarkedReviewIds(getBookmarkedReviews());
  };

  const bookmarkedReviews = reviewData
    ? reviewData?.data?.filter(
        (review: any) =>
          bookmarkedReviewIds.includes(review.review_id) &&
          (filterType === 'course' ? review.review_type_id === 1 : review.review_type_id === 2)
      )
    : [];

  if (reviewError) return <div>Failed to load data</div>;
  if (!reviewData)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
        &nbsp;&nbsp; Loading ...
      </div>
    );
  return (
    <Box
      w={{ base: '100%', '2xl': '80%' }}
      bgColor={flexStyle.bgColor}
      margin="0 auto"
      p={{ base: '3', sm: '3', md: '3', lg: '5' }}
    >
      <Heading
        as="h1"
        color={flexStyle.headingColor}
        fontSize={{ base: '24', sm: '30', md: '30', lg: '36' }}
        pb={4}
      >
        My Bookmarked Reviews
      </Heading>
      <Flex
        alignItems="centre"
        justifyContent="centre"
        gap={2}
        pb={4}
        w={{ base: '100%', sm: '100%', md: '250px', lg: '270px' }}
      >
        <Select
          id="reviews-filter"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as 'course' | 'professor')}
        >
          <option value="course">Course Reviews</option>
          <option value="professor">Professor Reviews</option>
        </Select>
      </Flex>
      {reviewData?.data ? (
        <Flex direction="column" gap={2} py={2}>
          {bookmarkedReviews.length > 0 ? (
            bookmarkedReviews.map((r: any) => (
              <BookmarkedReview
                key={r.review_id}
                review={r}
                onToggleBookmark={handleToggleBookmark}
              />
            ))
          ) : (
            <Heading as="h2" fontSize="lg" textAlign="center" color={flexStyle.headingColor}>
              No bookmarked reviews found for the selected filter.
            </Heading>
          )}
        </Flex>
      ) : (
        <Flex justifyContent="center" alignItems="center">
          <Spinner />
        </Flex>
      )}
    </Box>
  );
};

export default Bookmark;
