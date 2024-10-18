import { useState, useEffect, useRef } from 'react';
import { Grid, GridItem, Heading, Box, Text, Button, Flex } from '@chakra-ui/react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

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
}: {
  review: CourseReview;
  expandedReviewId: number;
  toggleExpandedReview: (id: number) => void;
}) {
  const [isTruncated, setIsTruncated] = useState(false); // Track whether the text is truncated
  const textRef = useRef<HTMLParagraphElement>(null); // Reference to the Text element

  // Check if the text is visually truncated (ellipsis rendered)
  useEffect(() => {
    if (textRef.current) {
      // Set to `true` if scrollHeight exceeds the actual visible height (truncated content)
      const isTextTruncated =
        textRef.current.scrollHeight > textRef.current.clientHeight ||
        textRef.current.scrollWidth > textRef.current.clientWidth;

      setIsTruncated(isTextTruncated);
    }
  }, []);
  return (
    <Box key={review.id} p={{ base: '2', lg: '3' }}>
      <Heading
        as="h3"
        fontSize={{ base: '22', sm: '24', md: '26', lg: '30' }}
        color="blackAlpha.600"
        pb={5}
      >
        {review.title}
      </Heading>
      <Grid templateColumns="repeat(12, 1fr)" gap={2}>
        <GridItem gridColumn={{ base: 'span 12', lg: 'span 8' }}>
          <Flex flexDirection="column" gap={2}>
            <Text ref={textRef} noOfLines={expandedReviewId === review.id ? 0 : [4, 3]}>
              {review.content.join(' ')}
            </Text>
            {isTruncated && (
              <Button
                variant="link"
                onClick={() => toggleExpandedReview(review.id)}
                color="teal"
                alignSelf="end"
                mr={{ base: '0', lg: '2' }}
              >
                {expandedReviewId === review.id ? 'See Less' : 'See More'}
              </Button>
            )}
          </Flex>
        </GridItem>
        <GridItem
          textAlign={{ base: 'left', lg: 'right' }}
          gridColumn={{ base: 'span 12', lg: 'span 4' }}
        >
          <Box>
            <Text as="b">Would take again:</Text> {review.wouldTakeAgain}
          </Box>
          <Box>
            <Text as="b">Difficulty:</Text> {review.difficulty}/5
          </Box>
          <Box>
            <Text as="b">Course Load:</Text> {review.courseLoad}/5
          </Box>
          <Box>
            <Text as="b">Grade:</Text> {review.grade}
          </Box>
        </GridItem>
        <GridItem gridColumn={{ base: 'span 12', lg: 'span 8' }}>
          <Box>
            <Text as="b">Professor:</Text> David Humphrey
          </Box>
        </GridItem>
        <GridItem
          justifySelf={{ base: 'start', lg: 'end' }}
          gridColumn={{ base: 'span 12', lg: 'span 4' }}
          color="teal"
        >
          {review.bookmark ? <FaBookmark size={25} /> : <FaRegBookmark size={25} />}
        </GridItem>
      </Grid>
    </Box>
  );
}
