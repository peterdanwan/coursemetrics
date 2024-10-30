import { Box, Flex, Stack, Text, Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import ReviewsStatusIcon from './ReviewsStatusIcon';
import useSWR from 'swr';
import { apiFetcher } from '@/utils';

const ReviewsTable: React.FC<{ reviews: any[] }> = ({ reviews }) => {
  const router = useRouter();
  const { data: reviewData, error: reviewError } = useSWR('/api/reviews', apiFetcher);
  console.log('Reviews Data: ', reviewData);

  const displayedReviews = reviewData?.data || reviews;

  const sortedReviews = [...displayedReviews].sort((a, b) => {
    // Check the review status based on review_status_id
    const statusA = a.review_status_id;
    const statusB = b.review_status_id;

    // Sort 'pending' (status id 1) first
    if (statusA === 1 && statusB !== 1) return -1; // a is pending, b is not
    if (statusB === 1 && statusA !== 1) return 1; // b is pending, a is not

    // Secondary sort by rating (assuming rating is a numerical value)
    return b.rating - a.rating; // Sort by rating in descending order
  });

  const handleViewDetailsClick = (reviewId: string) => {
    router.push(`/admin/manage/get-review/${reviewId}`);
  };

  if (reviewError) return <div>Failed to load reviews</div>;
  if (!reviewData) return <div>Loading...</div>;

  return (
    <>
      {/* Table Header */}
      <Flex
        bg="gray.50"
        p={2}
        borderRadius="md"
        justify="space-between"
        fontWeight="bold"
        color="black"
        align="center"
      >
        <Text flex="1" textAlign="left">
          Category
        </Text>
        <Text flex="1" textAlign="left">
          Course Code
        </Text>
        <Text flex="2" textAlign="left">
          Review
        </Text>
        <Text flex="1" textAlign="center">
          Avg. Rating
        </Text>
        <Text flex="1" textAlign="left">
          Options
        </Text>
        <Text flex="1" textAlign="center">
          Status
        </Text>
      </Flex>

      {/* Scrollable Stack Container */}
      <Box
        mt={4}
        maxHeight="65vh"
        overflowY="auto"
        p={2}
        css={{
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}
      >
        <Stack spacing={4}>
          {sortedReviews.map((review: any) => (
            <Box
              key={review.review_id}
              borderWidth="1px"
              borderRadius="lg"
              padding={4}
              bg="gray.50"
            >
              <Flex justify="space-between" align="center">
                {/* Category */}
                <Text flex="1" color="black" m={1}>
                  {review.review_type_id === 1 ? 'Course Review' : 'Professor Review'}
                </Text>

                {/* Course Code */}
                <Text flex="1" color="black" m={1}>
                  {review.ProfessorCourse.Course.course_code}
                </Text>

                {/* Truncated Review */}
                <Text flex="2" color="black" isTruncated m={1}>
                  {review.comment}
                </Text>

                {/* Average Rating */}
                <Text flex="1" color="black" m={1} textAlign="center">
                  {review.rating.toFixed(1)} / 5
                </Text>

                {/* Options Buttons */}
                <Flex
                  flexDirection={{ base: 'column', md: 'row' }}
                  justifyContent="space-between"
                  m={1}
                  gap={4}
                  flex="1"
                >
                  <Button
                    colorScheme="teal"
                    color="white"
                    flex="1"
                    mr={{ base: 0, md: 1 }}
                    mb={{ base: 1, md: 0 }}
                    onClick={() => handleViewDetailsClick(review.review_id)}
                  >
                    View Details
                  </Button>
                </Flex>

                {/* Status Icon */}
                <Text flex="1" textAlign="center" ml={5}>
                  <ReviewsStatusIcon
                    status={
                      review.review_status_id === 1
                        ? 'pending'
                        : review.review_status_id === 2
                          ? 'approved'
                          : 'rejected'
                    }
                  />
                </Text>
              </Flex>
            </Box>
          ))}
        </Stack>
      </Box>
    </>
  );
};

export default ReviewsTable;
