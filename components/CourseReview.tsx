import { useState, useEffect, useRef } from 'react';
import { Grid, GridItem, Heading, Box, Text, Button, Flex, useDisclosure } from '@chakra-ui/react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import ReviewDetailModal from './ReviewDetailModal';

interface CourseReview {
  id: number;
  title: string;
  content: string[];
  wouldTakeAgain: string;
  difficulty: number;
  courseLoad: number;
  grade: string;
  professor: string;
  bookmark: boolean;
}

export default function CourseReview({
  review,
  expandedReviewId,
  toggleExpandedReview,
}: // isFormOpen,
{
  review: any;
  expandedReviewId: number;
  toggleExpandedReview: (id: number) => void;
  // isFormOpen: any;
}) {
  const [isTruncated, setIsTruncated] = useState(false); // Track whether the text is truncated
  const textRef = useRef<HTMLParagraphElement>(null); // Reference to the Text element

  // // Check if the text is visually truncated (ellipsis rendered)
  // useEffect(() => {
  //   if (textRef.current) {
  //     // Set to `true` if scrollHeight exceeds the actual visible height (truncated content)
  //     const isTextTruncated =
  //       textRef.current.scrollHeight > textRef.current.clientHeight ||
  //       textRef.current.scrollWidth > textRef.current.clientWidth;

  //     setIsTruncated(isTextTruncated);
  //   }
  // }, []);

  const {
    isOpen: isReviewDetailOpen,
    onOpen: onReviewDetailOpen,
    onClose: onReviewDetailClose,
  } = useDisclosure();

  const handleSeeMoreClick = () => {};
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
        <Box
          // justifySelf={{ base: 'start', lg: 'end' }}
          // gridColumn={{ base: 'span 12', lg: 'span 4' }}
          color="teal"
        >
          {review.bookmark ? <FaBookmark size={25} /> : <FaRegBookmark size={25} />}
        </Box>
      </Flex>

      <Grid templateColumns="repeat(12, 1fr)" gap={2}>
        <GridItem gridColumn={{ base: 'span 12', lg: 'span 8' }}>
          <Flex flexDirection="column" gap={2}>
            <Text noOfLines={[4, 3]}>{review.comment}</Text>
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
            <Text as="b">Overall Rating:</Text> {review.rating}/5
          </Box>
          {/* <Box>
            <Text as="b">Would take again:</Text> {review.would_take_again ? 'Yes' : 'No'}
          </Box>
          <Box>
            <Text as="b">Difficulty:</Text> {review.difficulty}/5
          </Box>
          <Box>
            <Text as="b">Course Load:</Text> {review.course_load}/5
          </Box> */}
          <Box>
            <Text as="b">Grade:</Text> {review.grade}
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
