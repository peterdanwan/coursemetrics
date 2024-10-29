// app/admin/manage/edit-course/[id]/page.tsx
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

// ************************************************** SAMPLE DATA TO BE REMOVED WHEN BACKEND FINISH **************************************************
const sampleProfessors = [
  { value: '1', label: 'Professor A' },
  { value: '2', label: 'Professor B' },
  { value: '3', label: 'Professor C' },
  { value: '4', label: 'Professor D' },
  { value: '5', label: 'Professor E' },
  { value: '6', label: 'Professor F' },
  { value: '7', label: 'Professor G' },
];

const sampleTerms = [
  { value: 'Winter 2024', label: 'Winter 2024' },
  { value: 'Summer 2024', label: 'Summer 2024' },
  { value: 'Fall 2024', label: 'Fall 2024' },
  { value: 'Winter 2025', label: 'Winter 2025' },
  { value: 'Summer 2025', label: 'Summer 2025' },
  { value: 'Fall 2025', label: 'Fall 2025' },
];

// ******************************************************************************************************************************************************************

export default withAdminAuth(function EditCourse({ user }: { user: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('id');

  const [selectedProfessors, setSelectedProfessors] = useState<{ value: string; label: string }[]>(
    []
  );
  const [selectedTerm, setSelectedTerm] = useState('');
  const [courseData, setCourseData] = useState({ name: '', section: '', description: '' });

  useEffect(() => {
    // Fetch the course data from the backend using courseId
    const fetchCourseData = async () => {
      const course = {
        id: '1',
        name: 'Course 1',
        section: 'A',
        description: 'Introductory course to programming.',
        term: 'Fall 2024',
        professors: [
          { value: '1', label: 'John Doe' },
          { value: '2', label: 'Jane Smith' },
        ],
      };
      setCourseData(course);
      setSelectedProfessors(course.professors);
      setSelectedTerm(course.term);
    };

    fetchCourseData();
  }, [courseId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the update course logic here
    console.log({
      ...courseData,
      selectedProfessors,
      selectedTerm,
    });
  };

  const handleCancel = () => {
    router.push('/admin/manage');
  };

  const handleProfessorChange = (newValue: MultiValue<{ value: string; label: string }>) => {
    setSelectedProfessors(newValue as { value: string; label: string }[]);
  };

  return (
    <Flex direction="column" align="center" justify="center" minHeight="100vh" bg="gray.50" p={5}>
      <Box width={{ base: '90%', sm: '500px' }} borderRadius="lg" shadow="md" bg="white" p={8}>
        <Heading as="h1" size="lg" mb={6} textAlign="center" color="teal">
          Edit Course
        </Heading>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel htmlFor="course-name" color="black">
                Course Name
              </FormLabel>
              <Input
                value={courseData.name}
                onChange={(e) => setCourseData({ ...courseData, name: e.target.value })}
                required
                color="black"
                focusBorderColor="teal"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="section-code" color="black">
                Section Code
              </FormLabel>
              <Input
                value={courseData.section}
                onChange={(e) => setCourseData({ ...courseData, section: e.target.value })}
                required
                color="black"
                focusBorderColor="teal"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="professor-name" color="black">
                Select Professors
              </FormLabel>
              <Select
                isMulti
                options={sampleProfessors}
                value={selectedProfessors}
                onChange={handleProfessorChange}
                styles={customStyles}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="term" color="black">
                Select Term
              </FormLabel>
              <Select
                options={sampleTerms}
                value={{ value: selectedTerm, label: selectedTerm }}
                onChange={(option) => setSelectedTerm(option?.value || '')}
                styles={customStyles}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="description" color="black">
                Description
              </FormLabel>
              <Textarea
                value={courseData.description}
                onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                required
                color="black"
                focusBorderColor="teal"
              />
            </FormControl>
            <Button type="submit" colorScheme="teal" color="white">
              Update Course
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
