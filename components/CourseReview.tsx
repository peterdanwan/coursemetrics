import { Grid, GridItem, Heading, Box, Text, Button } from '@chakra-ui/react';

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
    <Box key={review.id} p={5}>
      <Heading as="h3" size="lg" color="blackAlpha.600" pb={5}>
        {review.title}
      </Heading>
      <Grid templateColumns="repeat(5, 1fr)" gap={2}>
        <GridItem gridColumn="span 4">
          <Text noOfLines={expandedReviewId === review.id ? 0 : 3}>{review.content}</Text>
        </GridItem>
        <GridItem textAlign="right">
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
        <GridItem gridColumn={4} justifySelf="end">
          <Button variant="link" onClick={() => toggleExpandedReview(review.id)} color="teal">
            {expandedReviewId === review.id ? 'See Less' : 'See More'}
          </Button>
        </GridItem>
        <GridItem gridColumn="span 4">
          <Box>
            <Text as="b">Professor:</Text> David Humphrey
          </Box>
        </GridItem>
        <GridItem textAlign="right">{review.bookmark ? 'Bookmarked' : 'Bookmark'}</GridItem>
      </Grid>
    </Box>
  );
}
