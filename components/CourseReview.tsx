// components/CourseReview.tsx
'use client';
import { Grid, GridItem, Heading, Box, Text, Button, Flex, useDisclosure } from '@chakra-ui/react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import ReviewDetailModal from './ReviewDetailModal';
import RatingIcons from './RatingIcons';
import { useState, useEffect } from 'react';
import { toggleReviewBookmark, isReviewBookmarked } from '@/utils/localStorageHelpers';

export default function CourseReview({ review }: { review: any }) {
  const {
    isOpen: isReviewDetailOpen,
    onOpen: onReviewDetailOpen,
    onClose: onReviewDetailClose,
  } = useDisclosure();

  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    setIsBookmarked(isReviewBookmarked(review.review_id));
  }, [review.review_id]);

  const handleToggleBookmark = () => {
    const updatedBookmarkState = toggleReviewBookmark(review.review_id);
    setIsBookmarked(updatedBookmarkState);
  };

  return (
    <Box key={review.review_id} p={{ base: '2', lg: '3' }}>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading
          as="h3"
          fontSize={{ base: '22', sm: '24', md: '26', lg: '30' }}
          color="blackAlpha.600"
          pb={5}
        >
          {review.title}
        </Heading>
        <Box color="teal" onClick={handleToggleBookmark} cursor="pointer">
          {isBookmarked ? <FaBookmark size={25} /> : <FaRegBookmark size={25} />}
        </Box>
      </Flex>

      <Grid templateColumns="repeat(12, 1fr)" gap={2}>
        <GridItem gridColumn={{ base: 'span 12', lg: 'span 8' }}>
          <Flex flexDirection="column" gap={2}>
            <Text noOfLines={[5, 4]}>{review.comment}</Text>
          </Flex>
        </GridItem>
        <GridItem
          textAlign={{ base: 'left', lg: 'right' }}
          gridColumn={{ base: 'span 12', lg: 'span 4' }}
        >
          <Box>
            <Text as="b">Course Term:</Text> {review.ProfessorCourse.Course.CourseTerm.season}{' '}
            {review.ProfessorCourse.Course.CourseTerm.year}
          </Box>
          <Box>
            <Text as="b">Overall Rating: </Text>
            <RatingIcons rating={review.rating} />
          </Box>
          <Box>
            <Text as="b">Grade:</Text> {review.grade}
          </Box>
          <Box>
            <Text as="b">Would take again:</Text> {review.would_take_again ? 'Yes' : 'No'}
          </Box>
        </GridItem>
        <GridItem gridColumn={{ base: 'span 12', lg: 'span 8' }}>
          <Box>
            <Text as="b">Professor:</Text> {review.ProfessorCourse.Professor.first_name}{' '}
            {review.ProfessorCourse.Professor.last_name}
          </Box>
        </GridItem>
        <GridItem
          textAlign={{ base: 'left', lg: 'right' }}
          gridColumn={{ base: 'span 12', lg: 'span 4' }}
        >
          <Button
            variant="link"
            onClick={onReviewDetailOpen}
            color="teal"
            alignSelf="end"
            mr={{ base: '0', lg: '2' }}
          >
            See More
          </Button>
        </GridItem>
      </Grid>
      <ReviewDetailModal
        isReviewDetailOpen={isReviewDetailOpen}
        onReviewDetailClose={onReviewDetailClose}
        review={review}
      />
    </Box>
  );
}
