// app/user/reviews/myprofessors/page.tsx
'use client';
import { Box, Flex, Stack, Text, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import StatusIcon from '@/components/StatusIcon';
import { useState } from 'react';

// ************************************************** SAMPLE DATA TO BE REMOVED WHEN BACKEND FINISH **************************************************
const reviews = [
  {
    category: 'Course Review',
    course_code: 'CSC101',
    review_text:
      'This course provides a solid introduction to computer science, with a focus on programming fundamentals. Highly recommended for beginners!',
    average_rate: 4.5,
    status: 'approved',
    created_date: new Date('2024-01-15'),
  },
  {
    category: 'Course Review',
    course_code: 'MTH202',
    review_text:
      'The content was quite challenging, but the professor was very helpful. I struggled with some concepts, but overall, it was a good learning experience.',
    average_rate: 3.8,
    status: 'pending',
    created_date: new Date('2024-02-10'),
  },
  {
    category: 'Professor Review',
    professor_name: 'James Smith',
    course_code: 'PHY303',
    review_text:
      'Professor Smith explains difficult concepts clearly and is always available to answer questions. However, the exams were much harder than expected.',
    average_rate: 4.2,
    status: 'approved',
    created_date: new Date('2024-02-10'),
  },
  {
    category: 'Course Review',
    course_code: 'ENG104',
    review_text:
      'I didn’t enjoy the lectures, but the assignments were interesting. The course material felt outdated, and there was little class interaction.',
    average_rate: 2.5,
    status: 'rejected',
    created_date: new Date('2024-01-15'),
  },
  {
    category: 'Professor Review',
    professor_name: 'Johnson Thompson',
    course_code: 'CHE201',
    review_text:
      'Dr. Thompson is a brilliant professor but can be very strict. If you want to succeed in this class, you need to work hard and follow all the guidelines.',
    average_rate: 4.0,
    status: 'pending',
    created_date: new Date('2024-05-15'),
  },
  {
    category: 'Course Review',
    course_code: 'CSC101',
    review_text:
      'This course provides a solid introduction to computer science, with a focus on programming fundamentals. Highly recommended for beginners!',
    average_rate: 4.5,
    status: 'approved',
    created_date: new Date('2024-08-15'),
  },
  {
    category: 'Course Review',
    course_code: 'MTH202',
    review_text:
      'The content was quite challenging, but the professor was very helpful. I struggled with some concepts, but overall, it was a good learning experience.',
    average_rate: 3.8,
    status: 'pending',
    created_date: new Date('2024-10-31'),
  },
];

// ******************************************************************************************************************************************************************

export default function Professors() {
  // Make sure to add a logic that fetches the reviews of the specific user

  const sortedReviews = [...reviews]
    // Filter by Course Review category
    .filter((review) => review.category === 'Professor Review')
    .sort((a, b) => {
      // Sort by recent date first
      const dateComparison =
        new Date(b.created_date).getTime() - new Date(a.created_date).getTime();

      if (dateComparison !== 0) {
        return dateComparison;
      }

      // secondary sort
      return b.average_rate - a.average_rate;
    });

  const [searchValue, setSearchValue] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const filteredReviews = sortedReviews.filter((review) => {
    const normalizedRate = review.average_rate.toFixed(1);
    return (
      review.review_text.toLowerCase().includes(searchValue.toLowerCase()) ||
      review.category.toLowerCase().includes(searchValue.toLowerCase()) ||
      review.course_code.toLowerCase().includes(searchValue.toLowerCase()) ||
      review.status.toLowerCase().includes(searchValue.toLowerCase()) ||
      normalizedRate.includes(searchValue)
    );
  });

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
          Professor Name
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
          {filteredReviews.map((review, index) => (
            <Box key={index} borderWidth="1px" borderRadius="lg" padding={4} bg="gray.50">
              <Flex justify="space-between" align="center">
                {/* Professor Name */}
                <Text flex="1" color="black" m={1}>
                  {review.professor_name}
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
                  <StatusIcon status={review.status} />
                </Text>
              </Flex>
            </Box>
          ))}
        </Stack>
      </Box>
    </>
  );
}
