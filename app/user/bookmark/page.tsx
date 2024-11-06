'use client';
import { useState, useEffect } from 'react';
import { Box, Flex, Heading, Select, Spinner } from '@chakra-ui/react';
import { useFlexStyle } from '@/styles/styles';
import BookmarkedReview from '@/components/BookmarkedReview';

const courseReviews = [
  {
    review_type_id: 1,
    course_code: 'CSC101',
    course_section: 'ABC',
    course_term: 'Fall 2024',
    comment: 'Very engaging course with a great professor!',
    rating: 5,
  },
  {
    review_type_id: 1,
    course_code: 'MAT202',
    course_section: 'XYZ',
    course_term: 'Spring 2024',
    comment: 'Challenging but rewarding experience. Learned a lot.',
    rating: 4,
  },
  {
    review_type_id: 1,
    course_code: 'ENG303',
    course_section: 'LMN',
    course_term: 'Winter 2023',
    comment: 'Interesting content, but the workload was quite heavy.',
    rating: 3,
  },
  {
    review_type_id: 1,
    course_code: 'HIS404',
    course_section: 'DEF',
    course_term: 'Summer 2024',
    comment: 'Good overview of history with interactive discussions.',
    rating: 4,
  },
  {
    review_type_id: 1,
    course_code: 'BIO505',
    course_section: 'GHI',
    course_term: 'Fall 2023',
    comment: 'Content was a bit too advanced, but well structured.',
    rating: 3,
  },
];

const professorReviews = [
  {
    review_type_id: 2,
    professor_name: 'Emily Carter',
    course_code: 'CSC101',
    course_section: 'ABC',
    course_term: 'Fall 2024',
    comment: 'Prof Carter is very knowledgeable and makes difficult topics easier to understand.',
    rating: 5,
  },
  {
    review_type_id: 2,
    professor_name: 'John Smith',
    course_code: 'MAT202',
    course_section: 'XYZ',
    course_term: 'Spring 2024',
    comment: 'Great explanations but sometimes hard to follow during lectures.',
    rating: 4,
  },
  {
    review_type_id: 2,
    professor_name: 'Sarah Lee',
    course_code: 'ENG303',
    course_section: 'LMN',
    course_term: 'Winter 2023',
    comment: 'Very approachable and helpful during office hours.',
    rating: 5,
  },
  {
    review_type_id: 2,
    professor_name: 'Robert King',
    course_code: 'HIS404',
    course_section: 'DEF',
    course_term: 'Summer 2024',
    comment: 'Good course content but prof King’s lectures can be too fast-paced.',
    rating: 3,
  },
  {
    review_type_id: 2,
    professor_name: 'Lisa Chen',
    course_code: 'BIO505',
    course_section: 'GHI',
    course_term: 'Fall 2023',
    comment: 'Knowledgeable professor but could improve engagement with students.',
    rating: 4,
  },
];

const Bookmark = () => {
  const flexStyle = useFlexStyle();

  const [isFilteredByCourse, setFilteredByCourse] = useState(true);
  const [reviews, setReviews] = useState<any>(null);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilteredByCourse(e.target.value === 'course');
  };

  useEffect(() => {
    // helper function (may only work for mock data;
    // for real data may have to modify the function
    const sortReviews = (reviews: any, review_type_id: number) => {
      return [...reviews].sort((r1: any, r2: any) => {
        if (review_type_id === 1) return r1.course_code.localeCompare(r2.course_code);
        if (review_type_id === 2) return r1.professor_name.localeCompare(r2.professor_name);
        return 0;
      });
    };

    isFilteredByCourse
      ? setReviews(sortReviews(courseReviews, 1))
      : setReviews(sortReviews(professorReviews, 2));
  }, [isFilteredByCourse, setReviews]);

  return (
    <Box
      w={{ base: '100%', '2xl': '80%' }}
      bgColor={flexStyle.bgColor}
      margin="0 auto"
      p={{ base: '3', sm: '3', md: '3', lg: '5' }}
    >
      <Heading as="h1" color="teal" fontSize={{ base: '24', sm: '30', md: '30', lg: '36' }} pb={4}>
        My Bookmarked Reviews
      </Heading>
      <Flex
        alignItems="centre"
        justifyContent="centre"
        gap={2}
        pb={4}
        w={{ base: '100%', sm: '100%', md: '250px', lg: '270px' }}
      >
        <Select id="reviews-filter" onChange={handleFilterChange}>
          <option value="course">Course Reviews</option>
          <option value="professor">Professor Reviews</option>
        </Select>
      </Flex>
      {reviews ? (
        <Flex direction="column" gap={2} py={2}>
          {reviews.map((r: any) => (
            <BookmarkedReview key={r.course_code} review={r} />
          ))}
        </Flex>
      ) : (
        <Flex justifyContent="center" alignItems="center">
          <Spinner />
        </Flex>
      )}
    </Box>
  );
};

export default Bookmark;
