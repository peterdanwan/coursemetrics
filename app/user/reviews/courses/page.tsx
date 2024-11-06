// app/user/reviews/courses/page.tsx
'use client';
import { Box, Flex, Stack, Text, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import ReviewsStatusIcon from '@/components/ReviewsStatusIcon';
import { useState, useEffect } from 'react';
import { apiFetcher } from '@/utils';
import useSWR from 'swr';

export default function Courses() {
  const { data: reviewCourseData, error: reviewCourseError } = useSWR('/api/users', apiFetcher);

  console.log('Review Course Data:', reviewCourseData);

  const sortedReviews = [...(reviewCourseData?.data?.user?.Reviews || [])]
    .filter((review) => review.review_type_id === 1)
    .sort((a, b) => {
      // Sort by the most recent review first
      const dateComparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (dateComparison !== 0) {
        return dateComparison;
      }
      // Secondary sort by rating (descending)
      return b.rating - a.rating;
    });

  console.log('Sorted Reviews:', sortedReviews);

  const [searchValue, setSearchValue] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const filteredReviews = sortedReviews.filter((review) => {
    const normalizedRate = review.rating?.toFixed(1);
    return (
      review.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchValue.toLowerCase()) ||
      normalizedRate?.includes(searchValue)
    );
  });

  console.log('Filtered Reviews:', filteredReviews);

  if (reviewCourseError) return <Text color="red.500">Failed to load course reviews</Text>;
  if (!reviewCourseData) return <Text>Loading...</Text>;
  return (
    <>
      <Box p={4}>
        <Flex justify="space-between" align="center" mb={4} p={4}>
          <Stack direction="row" spacing={4} flex="1" maxW="50%" align="center">
            <Text color="white" fontWeight="bold">
              Filter:
            </Text>

            <FormControl>
              <FormLabel htmlFor="search" srOnly>
                Search
              </FormLabel>
              <Input
                id="search"
                placeholder="Search"
                size="md"
                type="search"
                value={searchValue}
                onChange={handleInputChange}
                paddingX={4}
                _placeholder={{ color: 'gray.400' }}
              />
            </FormControl>
          </Stack>
        </Flex>
      </Box>
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
          Course Code
        </Text>
        <Text flex="2" textAlign="left">
          Term
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
          {filteredReviews.map((review, index) => (
            <Box key={index} borderWidth="1px" borderRadius="lg" padding={2} bg="gray.50">
              <Flex justify="space-between" align="center">
                {/* Course Code */}
                <Text flex="1" color="black" m={1}>
                  {review.ProfessorCourse?.Course?.course_code}
                </Text>

                {/* Term */}
                <Text flex="2" color="black" isTruncated m={1}>
                  {`${review.ProfessorCourse?.Course?.CourseTerm?.season} ${review.ProfessorCourse?.Course?.CourseTerm?.year}`}
                </Text>

                {/* Truncated Review */}
                <Text flex="2" color="black" isTruncated m={1}>
                  {review.comment}
                </Text>

                {/* Average Rating */}
                <Text flex="1" color="black" m={1} textAlign="center">
                  {review.rating?.toFixed(1)} / 5
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
                  >
                    Edit
                  </Button>
                  <Button
                    colorScheme="teal"
                    color="white"
                    flex="1"
                    mr={{ base: 0, md: 1 }}
                    mb={{ base: 1, md: 0 }}
                  >
                    Delete
                  </Button>
                </Flex>

                {/* Status Icon */}
                <Text flex="1" textAlign="center" m={1}>
                  <ReviewsStatusIcon status={review.review_status_id} />
                </Text>
              </Flex>
            </Box>
          ))}
        </Stack>
      </Box>
    </>
  );
}
