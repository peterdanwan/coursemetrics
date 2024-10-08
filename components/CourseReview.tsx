import { Grid, GridItem, Heading, Box, Text, Button, Flex } from '@chakra-ui/react';

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
            <Text noOfLines={expandedReviewId === review.id ? 0 : [4, 3]}>{review.content}</Text>
            <Button
              variant="link"
              onClick={() => toggleExpandedReview(review.id)}
              color="teal"
              alignSelf="end"
              mr={{ base: '0', lg: '2' }}
            >
              {expandedReviewId === review.id ? 'See Less' : 'See More'}
            </Button>
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
          textAlign={{ base: 'left', lg: 'right' }}
          gridColumn={{ base: 'span 12', lg: 'span 4' }}
        >
          {review.bookmark ? 'Bookmarked' : 'Bookmark'}
        </GridItem>
      </Grid>
    </Box>
  );
}
