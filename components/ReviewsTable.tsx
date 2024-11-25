// components/ReviewsTable.tsx
'use client';
import { Box, Flex, Stack, Text, Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import ReviewsStatusIcon from './ReviewsStatusIcon';
import { useFlexStyle } from '@/styles/styles';

const ReviewsTable: React.FC<{ reviews: any[] }> = ({ reviews }) => {
  const router = useRouter();
  const styles = useFlexStyle();

  const displayedReviews = reviews;
  //console.log('Reviews Data In Table: ', displayedReviews);

  const sortedReviews = [...displayedReviews].sort((a, b) => {
    // Check the review status based on review_status_id
    const statusA = a.review_status_id;
    const statusB = b.review_status_id;

    // Sort 'pending' (status id 1) first
    if (statusA === 1 && statusB !== 1) return -1; // a is pending, b is not
    if (statusB === 1 && statusA !== 1) return 1; // b is pending, a is not

    // Sort by rating in descending order
    return b.rating - a.rating;
  });

  const handleViewDetailsClick = (reviewId: string) => {
    router.push(`/admin/manage/get-review/${reviewId}`);
  };

  if (!reviews) return <div>Loading...</div>;

  return (
    <>
      {/* Table Header */}
      <Flex
        bg={styles.bgColor}
        p={2}
        borderRadius="md"
        justify="space-between"
        fontWeight="bold"
        color={styles.color}
        align="center"
      >
        <Text flex="1" textAlign="left">
          Category
        </Text>
        <Text flex="1" textAlign="left">
          Course Code
        </Text>
        <Text flex="2" textAlign="left">
          Review Title
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
        css={{
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: styles.bgColor,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: styles.borderColor,
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: styles.hoverBg,
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
              bg={styles.cardBg}
            >
              <Flex justify="space-between" align="center">
                {/* Category */}
                <Text flex="1" color={styles.color} m={1}>
                  {review.review_type_id === 1 ? 'Course Review' : 'Professor Review'}
                </Text>

                {/* Course Code */}
                <Text flex="1" color={styles.color} m={1}>
                  {review.ProfessorCourse.Course.course_code}
                </Text>

                {/* Truncated Review */}
                <Text flex="2" color={styles.color} isTruncated m={1}>
                  {review.title}
                </Text>

                {/* Average Rating */}
                <Text flex="1" color={styles.color} m={1} textAlign="center">
                  {review.rating.toFixed(2)} / 5
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
                  <ReviewsStatusIcon status={review.review_status_id} />
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
