// app/user/reviews/myprofessors/page.tsx
'use client';
import {
  Box,
  Flex,
  Stack,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Spinner,
} from '@chakra-ui/react';
import ReviewsStatusIcon from '@/components/ReviewsStatusIcon';
import { useState } from 'react';
import { apiFetcher } from '@/utils';
import useSWR from 'swr';
import { useFlexStyle } from '@/styles/styles';
import { useToast } from '@chakra-ui/react';
import { mutate } from 'swr';

export default function Professors() {
  const styles = useFlexStyle();
  const toast = useToast();
  const { data: reviewProfessorData, error: reviewProfessorError } = useSWR(
    '/api/users',
    apiFetcher
  );

  const deleteReview = async (reviewId: number) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message);
      }

      // Show success toast
      toast({
        title: 'Review successfully deleted.',
        description: `The review id ${reviewId} has been successfully deleted`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      mutate('/api/users');
    } catch (error) {
      console.error(error);
    }
  };

  //console.log('Review Course Data:', reviewProfessorData);

  const sortedReviews = [...(reviewProfessorData?.data?.user?.Reviews || [])]
    .filter((review) => review.review_type_id === 2)
    .sort((a, b) => {
      // Sort by recent date first
      const dateComparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

      if (dateComparison !== 0) {
        return dateComparison;
      }

      // secondary sort
      return b.rating - a.rating;
    });

  //console.log('Sorted Reviews:', sortedReviews);

  const [searchValue, setSearchValue] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const filteredReviews = sortedReviews.filter((review) => {
    const searchTerm = searchValue.toLowerCase().trim();
    const normalizedRate = review.rating?.toFixed(1);
    const fullName =
      `${review.ProfessorCourse.Professor.first_name} ${review.ProfessorCourse.Professor.last_name}`.toLowerCase();
    const combinedSeasonYear =
      `${review.ProfessorCourse.Course.CourseTerm.season} ${review.ProfessorCourse.Course.CourseTerm.year}`.toLowerCase();

    return (
      review.ProfessorCourse.Professor.first_name.toLowerCase().includes(searchTerm) ||
      review.ProfessorCourse.Professor.last_name.toLowerCase().includes(searchTerm) ||
      review.title.toLowerCase().includes(searchTerm) ||
      review.ProfessorCourse.Course.course_code.toLowerCase().includes(searchTerm) ||
      review.ProfessorCourse.Course.CourseTerm.season.toLowerCase().includes(searchTerm) ||
      String(review.ProfessorCourse.Course.CourseTerm.year).includes(searchTerm) ||
      normalizedRate?.includes(searchTerm) ||
      combinedSeasonYear.includes(searchTerm) ||
      fullName.includes(searchTerm)
    );
  });

  //console.log('Filtered Reviews:', filteredReviews);

  // Check if there are any reviews
  const hasReviews = filteredReviews.length > 0;

  if (reviewProfessorError) return <Text color="red.500">Failed to load professor reviews</Text>;
  if (!reviewProfessorData)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
        &nbsp;&nbsp;Loading the data ...
      </div>
    );

  return (
    <>
      <Box p={4} bg={styles.bgColor} color={styles.color}>
        <Flex justify="space-between" align="center" mb={4} p={4}>
          <Stack direction="row" spacing={4} flex="1" maxW="50%" align="center">
            <Text fontWeight="bold">Filter:</Text>

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
                bg={styles.cardBg}
                color={styles.color}
              />
            </FormControl>
          </Stack>
        </Flex>
      </Box>
      {/* Table Header */}
      <Flex
        bg={styles.cardBg}
        p={2}
        borderRadius="md"
        justify="space-between"
        fontWeight="bold"
        color={styles.cardColor}
        align="center"
      >
        <Text flex="2" textAlign="left">
          Professor Name
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
      {!hasReviews ? (
        <>
          <Box mt={4} p={4} bg={styles.cardBg} borderRadius="md">
            <Text color={styles.cardColor} fontSize="lg" textAlign="center">
              No professor reviews added yet.
            </Text>
          </Box>
        </>
      ) : (
        <>
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
              {filteredReviews.map((review, index) => (
                <Box
                  key={index}
                  borderWidth="1px"
                  borderRadius="lg"
                  padding={2}
                  bg={styles.cardBg}
                  _hover={{ bg: styles.hoverBg }}
                >
                  <Flex justify="space-between" align="center">
                    {/* Professor Name */}
                    <Text flex="2" color={styles.color} m={1}>
                      {review.professor_name}
                      {`${review.ProfessorCourse?.Professor?.first_name} ${review.ProfessorCourse?.Professor?.last_name}`}
                    </Text>
                    {/* Course Code */}
                    <Text flex="1" color={styles.color} m={1}>
                      {review.ProfessorCourse?.Course?.course_code}
                    </Text>

                    {/* Truncated Review */}
                    <Text flex="2" color={styles.color} isTruncated m={1}>
                      {review.title}
                    </Text>

                    {/* Average Rating */}
                    <Text flex="1" color={styles.color} m={1} textAlign="center">
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
                        flex="1"
                        mr={{ base: 0, md: 1 }}
                        mb={{ base: 1, md: 0 }}
                        onClick={() => deleteReview(review.review_id)}
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
      )}
    </>
  );
}
