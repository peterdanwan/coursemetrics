import { Box, Flex, Stack, Text, Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import ReviewsStatusIcon from './ReviewsStatusIcon';

// Define the Review type
type Review = {
  id: string;
  category: string;
  course_code: string;
  review_text: string;
  average_rate: number;
  status: string; // 'approved' | 'pending' | 'rejected'
};

// Props interface
interface ReviewsTableProps {
  reviews: Review[];
}

const ReviewsTable: React.FC<ReviewsTableProps> = ({ reviews }) => {
  const router = useRouter();
  // Sort reviews by status ('pending' first)
  const sortedReviews = [...reviews].sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (b.status === 'pending' && a.status !== 'pending') return 1;

    // secondary sort
    return b.average_rate - a.average_rate;
  });

  const handleViewDetailsClick = (reviewId: string) => {
    router.push(`/admin/manage/get-review/${reviewId}`);
  };

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
          {sortedReviews.map((review, index) => (
            <Box key={index} borderWidth="1px" borderRadius="lg" padding={4} bg="gray.50">
              <Flex justify="space-between" align="center">
                {/* Category */}
                <Text flex="1" color="black" m={1}>
                  {review.category}
                </Text>

                {/* Course Code */}
                <Text flex="1" color="black" m={1}>
                  {review.course_code}
                </Text>

                {/* Truncated Review */}
                <Text flex="2" color="black" isTruncated m={1}>
                  {review.review_text}
                </Text>

                {/* Average Rating */}
                <Text flex="1" color="black" m={1} textAlign="center">
                  {review.average_rate.toFixed(1)} / 5
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
                    onClick={() => handleViewDetailsClick(review.id)}
                  >
                    View Details
                  </Button>
                </Flex>

                {/* Status Icon */}
                <Text flex="1" textAlign="center" ml={5}>
                  <ReviewsStatusIcon
                    status={review.status as 'approved' | 'pending' | 'rejected'}
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
