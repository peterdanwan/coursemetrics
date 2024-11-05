'use client';

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Flex,
  Heading,
  Textarea,
} from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Select, { MultiValue } from 'react-select';
import withAdminAuth from '@/components/withAdminAuth';
import customStyles from '@/styles/customStyles';
import { apiFetcher } from '@/utils';
import useSWR from 'swr';
import { useParams } from 'next/navigation';

// ******************************************************************************************************************************************************************

export default withAdminAuth(function EditCourse({ user }: { user: any }) {
  const router = useRouter();
  const { id: professorId } = useParams();
  const [selectedCourses, setSelectedCourses] = useState<{ value: string; label: string }[]>([]);
  const [courseOptions, setCourseOptions] = useState<{ value: string; label: string }[]>([]);
  // Local state to manage the form inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const { data: professorsID, error: professorError } = useSWR(
    `/api/professors/${professorId}`,
    apiFetcher
  );
  const { data: courses, error: courseError } = useSWR('/api/courses', apiFetcher);
  console.log('Professors Data:', professorsID);
  console.log('Courses Data:', courses);

  useEffect(() => {
    if (professorsID) {
      // Set initial form state when professors data is loaded
      setFirstName(professorsID.data.professor.first_name);
      setLastName(professorsID.data.professor.last_name);

      // Map courses associated with the professor to the format required by the select input
      const professorCourses = professorsID.data.professorCourses.map((professorCourse: any) => {
        // Format label similarly to available courses (course_code + term)
        //const termInitial = getSeasonInitial(professorCourse.Course.CourseTerm.season);
        const termInitial = professorCourse.Course.CourseTerm.season;
        const label = `${professorCourse.Course.course_code}${professorCourse.Course.course_section} (${termInitial}${professorCourse.Course.CourseTerm.year})`;

        return {
          value: professorCourse.Course.course_id,
          label: label, // Now includes course code + term (season and year)
        };
      });

      setSelectedCourses(professorCourses); // Set the courses that the professor is teaching
    }
  }, [professorsID]);

  useEffect(() => {
    if (courses) {
      // Map all courses to match the format of { value: course_id, label: course_code }
      const allAvailableCourses = courses.data.courses.map((course: any) => {
        // Format the label to include both course_code and CourseTerm (season and year)
        //const termInitial = getSeasonInitial(course.CourseTerm.season);
        const termInitial = course.CourseTerm.season;
        const label = `${course.course_code}${course.course_section} (${termInitial}${course.CourseTerm.year})`;

        return {
          value: course.course_id,
          label: label, // Now includes course code + term (season and year)
        };
      });

      // Filter out courses already assigned to this professor from the available options
      const availableCourses = allAvailableCourses.filter(
        (course: any) => !selectedCourses.some((selected) => selected.value === course.value)
      );

      setCourseOptions(availableCourses); // Set remaining available courses for selection
    }
  }, [courses, selectedCourses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedProfessor = {
      first_name: firstName,
      last_name: lastName,
      courses: selectedCourses.map((course) => course.value), // so this is completed but I think I need to actually add it to the ProfessorCourse table
    };

    console.log('Submitting the following data to the API:', updatedProfessor);

    // Put the Update API endpoint here
  };

  const handleCancel = () => {
    router.push('/admin/manage');
  };

  const handleCoursesChange = (newValue: MultiValue<{ value: string; label: string }>) => {
    setSelectedCourses(newValue as { value: string; label: string }[]);
  };

  if (professorError || courseError) return <div>Failed to load data</div>;
  if (!professorsID || !courses) return <div>Loading...</div>;

  return (
    <Flex direction="column" align="center" justify="center" minHeight="100vh" bg="gray.50" p={5}>
      <Box width={{ base: '90%', sm: '500px' }} borderRadius="lg" shadow="md" bg="white" p={8}>
        <Heading as="h1" size="lg" mb={6} textAlign="center" color="teal">
          Edit Professor
        </Heading>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel htmlFor="first-name" color="black">
                First Name:
              </FormLabel>
              <Input
                id="first-name"
                value={firstName}
                onChange={(e) => {
                  console.log('Updating firstName to:', e.target.value);
                  setFirstName(e.target.value);
                }}
                required
                color="black"
                focusBorderColor="teal"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="last-name" color="black">
                Last Name:
              </FormLabel>
              <Input
                id="last-name"
                value={lastName}
                onChange={(e) => {
                  console.log('Updating lastName to:', e.target.value);
                  setLastName(e.target.value);
                }}
                required
                color="black"
                focusBorderColor="teal"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="course-name" color="black">
                Select Courses
              </FormLabel>
              <Select
                isMulti
                options={courseOptions}
                value={selectedCourses}
                onChange={handleCoursesChange}
                styles={customStyles}
              />
            </FormControl>
            <Button type="submit" colorScheme="teal" color="white">
              Update Professor
            </Button>
            <Button onClick={handleCancel} colorScheme="gray">
              Cancel
            </Button>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
});
