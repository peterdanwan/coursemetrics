'use client';
import {
  Select,
  Input,
  Box,
  FormControl,
  FormLabel,
  Stack,
  Button,
  Flex,
  Divider,
  Link,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import CoursesTable from '@/components/CoursesTable';
import ProfessorsTable from '@/components/ProfessorsTable';
import ReviewsTable from '@/components/ReviewsTable';
import withAdminAuth from '@/components/withAdminAuth';
import useSWR from 'swr';
import { apiFetcher } from '@/utils';

export default withAdminAuth(function Manage({ user }: { user: any }) {
  const searchParams = useSearchParams();
  const initialOption = searchParams.get('option') || '';
  const [selectedOption, setSelectedOption] = useState<string>(initialOption);
  const [searchValue, setSearchValue] = useState<string>('');

  const { data: professors, error: professorError } = useSWR('/api/professors', apiFetcher);
  const { data: reviews, error: reviewError } = useSWR('/api/reviews', apiFetcher);
  const { data: courses, error: courseError } = useSWR('/api/courses', apiFetcher);
  console.log('Professors Data:', professors);
  console.log('Reviews Data:', reviews);
  console.log('Courses Data:', courses);

  useEffect(() => {
    // If the initial option is empty, you can set it to courses
    if (!initialOption) {
      setSelectedOption(initialOption);
    }
  }, [initialOption]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  // Fix this when the BY ID and DELETE API is implemented
  const removeProfessor = async (professorId: number) => {
    try {
      const response = await fetch(`/api/professors/${professorId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete professor');
      }

      // Optionally, you can trigger a refetch or update state here to refresh the data
    } catch (error) {
      console.error('Error removing professor:', error);
    }
  };

  // Fix this when the BY ID and DELETE API is implemented
  const removeCourse = async (courseId: number) => {
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      // Optionally, you can trigger a refetch or update state here to refresh the data
    } catch (error) {
      console.error('Error removing course:', error);
    }
  };

  // Error handling for courses
  if (courseError || professorError || reviewError) return <div>Failed to load data</div>;
  if (!courses || !professors || !reviews) return <div>Loading...</div>;

  // Function to filter courses based on search value
  const filteredCourses = Array.isArray(courses)
    ? (courses as any[]).filter(
        (course) =>
          course.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          course.section.toLowerCase().includes(searchValue.toLowerCase()) ||
          course.term.toLowerCase().includes(searchValue.toLowerCase()) ||
          course.description.toLowerCase().includes(searchValue.toLowerCase())
      )
    : [];

  // Safely filter professors if defined
  const filteredProfessors = Array.isArray(professors)
    ? professors.filter((professor) => {
        const fullName = `${professor.first_name} ${professor.last_name}`.toLowerCase();
        return (
          professor.first_name.toLowerCase().includes(searchValue.toLowerCase()) ||
          professor.last_name.toLowerCase().includes(searchValue.toLowerCase()) ||
          fullName.includes(searchValue.toLowerCase())
        );
      })
    : [];

  // Safely filter reviews if defined
  const filteredReviews = Array.isArray(reviews)
    ? reviews.filter((review) => {
        const normalizedRate = review.average_rate.toFixed(1); // Keep one decimal place
        return (
          review.review_text.toLowerCase().includes(searchValue.toLowerCase()) ||
          review.category.toLowerCase().includes(searchValue.toLowerCase()) ||
          review.course_code.toLowerCase().includes(searchValue.toLowerCase()) ||
          review.status.toLowerCase().includes(searchValue.toLowerCase()) ||
          normalizedRate.includes(searchValue)
        );
      })
    : [];

  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Stack direction="row" spacing={4} flex="1" maxW="50%">
          <FormControl>
            <FormLabel htmlFor="options" srOnly>
              Select an option
            </FormLabel>
            <Select
              id="options"
              placeholder="Select option"
              value={selectedOption}
              onChange={handleSelectChange}
              sx={{
                color: 'white',
                '& option': {
                  color: 'black',
                },
              }}
            >
              <option value="courses">Courses</option>
              <option value="professors">Professors</option>
              <option value="reviews">Reviews</option>
            </Select>
          </FormControl>

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
            />
          </FormControl>
        </Stack>
        {/* Conditionally render Add button only for 'courses' and 'professors' */}
        {selectedOption === 'courses' && (
          <Link href="/admin/manage/add-course">
            <Button as="a" colorScheme="teal" color="white" px={6}>
              Add
            </Button>
          </Link>
        )}
        {selectedOption === 'professors' && (
          <Link href="/admin/manage/add-professor">
            <Button as="a" colorScheme="teal" color="white" px={6}>
              Add
            </Button>
          </Link>
        )}
      </Flex>

      <Divider mb={4} />
      {/* Conditionally render appropriate category when it is selected */}
      {selectedOption === 'professors' && (
        <ProfessorsTable professors={filteredProfessors} onRemove={removeProfessor} />
      )}
      {selectedOption === 'courses' && (
        <CoursesTable courses={filteredCourses} onRemove={removeCourse} />
      )}
      {selectedOption === 'reviews' && <ReviewsTable reviews={filteredReviews} />}
    </Box>
  );
});
