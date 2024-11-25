// app/admin/manage/page.tsx
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
  useToast,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import CoursesTable from '@/components/CoursesTable';
import ProfessorsTable from '@/components/ProfessorsTable';
import ReviewsTable from '@/components/ReviewsTable';
import withAdminAuth from '@/components/withAdminAuth';
import useSWR, { mutate } from 'swr';
import { apiFetcher } from '@/utils';
import { useFlexStyle } from '@/styles/styles';

export default withAdminAuth(function Manage({ user }: { user: any }) {
  const styles = useFlexStyle();
  const toast = useToast();
  const searchParams = useSearchParams();
  const initialOption = searchParams.get('option') || '';
  const [selectedOption, setSelectedOption] = useState<string>(initialOption);
  const [searchValue, setSearchValue] = useState<string>('');

  const { data: professors, error: professorError } = useSWR('/api/professors', apiFetcher);
  const { data: reviews, error: reviewError } = useSWR('/api/reviews', apiFetcher);
  const { data: courses, error: courseError } = useSWR('/api/courses', apiFetcher);
  //console.log('Professors Data:', professors);
  //console.log('Reviews Data Manage Page:', reviews);
  // console.log('Courses Data:', courses);

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
    //console.log('Search Value:', event.target.value);
    setSearchValue(event.target.value);
  };

  // Fix this when the BY ID and DELETE API is implemented
  const removeProfessor = async (professorId: number) => {
    try {
      const response = await fetch(`/api/professors/${professorId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message);
      }

      // Show success toast
      toast({
        title: `Professor successfully deleted.`,
        description: `The professor id ${professorId} has been successfully deleted.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      mutate('/api/professors');
    } catch (error: any) {
      // console.error(error);
      toast({
        title: `Error deleting professor.`,
        description:
          error.message ||
          `An error occurred while trying to delete the professor with ID ${professorId}.`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Fix this when the BY ID and DELETE API is implemented
  const removeCourse = async (courseId: number) => {
    try {
      const response = await fetch(`/api/courses/id/${courseId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message);
      }

      // Show success toast
      toast({
        title: `Course successfully deleted.`,
        description: `The course id ${courseId} has been successfully deleted.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      mutate('/api/courses');
    } catch (error: any) {
      // console.error(error);
      toast({
        title: `Error deleting course.`,
        description:
          error.message ||
          `An error occurred while trying to delete the course with ID ${courseId}.`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const filteredCourses = Array.isArray(courses?.data?.courses)
    ? courses.data.courses.filter((course: any) => {
        const searchTerm = searchValue.toLowerCase().trim();

        const combinedSeasonYear =
          `${course.CourseTerm.season} ${course.CourseTerm.year}`.toLowerCase();

        return (
          course.course_code.toLowerCase().includes(searchTerm) ||
          course.course_section.toLowerCase().includes(searchTerm) ||
          course.CourseDetail.course_description.toLowerCase().includes(searchTerm) ||
          course.CourseTerm.season.toLowerCase().includes(searchTerm) ||
          String(course.CourseTerm.year).includes(searchTerm) ||
          combinedSeasonYear.includes(searchTerm)
        );
      })
    : [];

  // Safely filter professors if defined
  const filteredProfessors = Array.isArray(professors?.data?.professors)
    ? professors.data.professors.filter((professor: any) => {
        const searchTerm = searchValue.toLowerCase().trim();
        const fullName = `${professor.first_name} ${professor.last_name}`.toLowerCase();
        return (
          professor.first_name.toLowerCase().includes(searchTerm) ||
          professor.last_name.toLowerCase().includes(searchTerm) ||
          fullName.includes(searchValue.toLowerCase())
        );
      })
    : [];

  // Safely filter reviews if defined
  const statusMapping: { [key: number]: string } = {
    1: 'Pending',
    2: 'Approved',
    3: 'Rejected',
  };
  const filteredReviews = Array.isArray(reviews?.data)
    ? reviews.data.filter((review: any) => {
        const searchTerm = searchValue.toLowerCase().trim();
        const normalizedRate = review.rating.toFixed(1);
        const reviewStatus = statusMapping[review.review_status_id]?.toLowerCase();

        return (
          review.title.toLowerCase().includes(searchTerm) ||
          review.comment.toLowerCase().includes(searchTerm) ||
          review.ProfessorCourse.Course.course_code.toLowerCase().includes(searchTerm) ||
          (reviewStatus && reviewStatus.includes(searchTerm)) ||
          normalizedRate.includes(searchTerm)
        );
      })
    : [];

  return (
    <Box p={4} bg={styles.bgColor} color={styles.color}>
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
                color: styles.color,
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
              bg={styles.cardBg}
              color={styles.color}
            />
          </FormControl>
        </Stack>
        {/* Conditionally render Add button only for 'courses' and 'professors' */}
        {selectedOption === 'courses' && (
          <Link href="/admin/manage/add-course">
            <Button as="a" colorScheme="teal" px={6}>
              Add
            </Button>
          </Link>
        )}
        {selectedOption === 'professors' && (
          <Link href="/admin/manage/add-professor">
            <Button as="a" colorScheme="teal" px={6}>
              Add
            </Button>
          </Link>
        )}
      </Flex>

      <Divider mb={4} borderColor={styles.dividerColor} />
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
