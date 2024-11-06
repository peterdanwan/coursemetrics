import { Box, Flex, Text, Heading, Select, Card, CardBody } from '@chakra-ui/react';
import { FaBookmark } from 'react-icons/fa';

const BookmarkedReview = ({ review }: { review: any }) => {
  const alignItemsVals = { base: 'start', sm: 'start', md: 'start', lg: 'start' };
  const directionVals = {
    base: 'row' as const,
    sm: 'row' as const,
    md: 'row' as const,
    lg: 'column' as const,
  };
  const justifyContentsVals = { base: 'start', sm: 'start', md: 'start', lg: 'start' };
  const smallTextLineHeight = { base: '1.2', sm: '1.2', md: '1.2', lg: 'normal' };
  const largeTextLineHeight = { base: '1', sm: '1', md: '1', lg: 'normal' };
  const fontSizeVals = { base: 'md', sm: 'md', md: 'md', lg: 'lg' };
  const iconJustifyContentVals = { base: 'start', sm: 'start', md: 'start', lg: 'center' };

  const isCourseReview = review.review_type_id === 1;

  const handleUnbookmarkClick = () => {
    console.log('Unbookmarked this review!');
  };
  return (
    <Card>
      <CardBody>
        <Flex gap={4} direction={{ base: 'column', sm: 'column', md: 'column', lg: 'row' }}>
          {!isCourseReview && (
            <Flex
              direction={directionVals}
              alignItems={alignItemsVals}
              justifyContent={justifyContentsVals}
              gap={2}
              w={{ base: '100%', sm: '100%', md: '100%', lg: '120px' }}
            >
              <Text fontSize="sm" color="teal" lineHeight={smallTextLineHeight}>
                Professor
              </Text>
              <Text fontSize={fontSizeVals} as="b" lineHeight={largeTextLineHeight}>
                {review.professor_name}
              </Text>
            </Flex>
          )}
          <Flex
            direction={directionVals}
            alignItems={alignItemsVals}
            justifyContent={justifyContentsVals}
            gap={2}
            w={{ base: '100%', sm: '100%', md: '100%', lg: '80px' }}
          >
            <Text fontSize="sm" color="teal" lineHeight={smallTextLineHeight}>
              Course
            </Text>
            {isCourseReview ? (
              <Text fontSize={fontSizeVals} as="b" lineHeight={largeTextLineHeight}>
                {review.course_code}
              </Text>
            ) : (
              <Text fontSize={fontSizeVals} lineHeight={largeTextLineHeight}>
                {review.course_code}
              </Text>
            )}
          </Flex>
          <Flex
            direction={directionVals}
            alignItems={alignItemsVals}
            justifyContent={justifyContentsVals}
            gap={2}
            w="40px"
          >
            <Text fontSize="sm" color="teal" lineHeight={smallTextLineHeight}>
              Section
            </Text>
            <Text fontSize={fontSizeVals} lineHeight={largeTextLineHeight}>
              {review.course_section}
            </Text>
          </Flex>
          <Flex
            direction={directionVals}
            gap={2}
            alignItems={alignItemsVals}
            justifyContent={justifyContentsVals}
            // w="115px"
            w={{ base: '100%', sm: '100%', md: '100%', lg: '115px' }}
          >
            <Text fontSize="sm" color="teal" lineHeight={smallTextLineHeight}>
              Term
            </Text>
            <Text fontSize={fontSizeVals} lineHeight={largeTextLineHeight}>
              {review.course_term}
            </Text>
          </Flex>
          <Flex
            direction={directionVals}
            alignItems={alignItemsVals}
            justifyContent={justifyContentsVals}
            gap={2}
            flex="1"
          >
            <Text fontSize="sm" color="teal" lineHeight={smallTextLineHeight}>
              Review
            </Text>
            <Text fontSize={fontSizeVals} lineHeight={largeTextLineHeight}>
              {review.comment}
            </Text>
          </Flex>
          <Flex
            direction={directionVals}
            alignItems={alignItemsVals}
            justifyContent={justifyContentsVals}
            gap={2}
            w="45px"
          >
            <Text fontSize="sm" color="teal" lineHeight={smallTextLineHeight}>
              Rating
            </Text>
            <Text fontSize={fontSizeVals} lineHeight={largeTextLineHeight}>
              {review.rating}/5
            </Text>
          </Flex>
          <Flex
            direction={directionVals}
            alignItems={alignItemsVals}
            justifyContent={justifyContentsVals}
            gap={2}
            w="55px"
          >
            <Text fontSize="sm" color="teal" lineHeight={smallTextLineHeight}>
              Remove
            </Text>
            <Flex justifyContent={iconJustifyContentVals} w="100%">
              <Box as="button" onClick={handleUnbookmarkClick}>
                <FaBookmark size="22px" color="#285E61" />
              </Box>
            </Flex>
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default BookmarkedReview;
