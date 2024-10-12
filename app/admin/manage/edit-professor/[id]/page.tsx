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

const sampleCourses = [
  { value: '1', label: 'Course A' },
  { value: '2', label: 'Course B' },
  { value: '3', label: 'Course C' },
  { value: '4', label: 'Course D' },
  { value: '5', label: 'Course E' },
  { value: '6', label: 'Course F' },
  { value: '7', label: 'Course G' },
  { value: '8', label: 'Course H' },
  { value: '9', label: 'Course I' },
  { value: '10', label: 'Course J' },
  // Add more professors as needed
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

export default function EditCourse() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const professorId = searchParams.get('id');

  const [selectedCourses, setSelectedCourses] = useState<{ value: string; label: string }[]>([]);
  const [professorData, setProfessorData] = useState({ first_name: '', last_name: '' });

  useEffect(() => {
    // Fetch the professor data from the backend using professorId
    const fetchProfessorData = async () => {
      const professor = {
        id: '1',
        first_name: 'John',
        last_name: 'Doe',
        courses: [
          { value: '1', label: 'Course A' },
          { value: '2', label: 'Course B' },
        ],
      };
      setProfessorData(professor);
      setSelectedCourses(professor.courses);
    };

    fetchProfessorData();
  }, [professorId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the update course logic here
    console.log({
      ...professorData,
      selectedCourses,
    });
  };

  const handleCancel = () => {
    router.push('/admin/manage');
  };

  const handleCoursesChange = (newValue: MultiValue<{ value: string; label: string }>) => {
    setSelectedCourses(newValue as { value: string; label: string }[]);
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
              <FormLabel htmlFor="first-name" color="black">
                First Name:
              </FormLabel>
              <Input
                value={professorData.first_name}
                onChange={(e) => setProfessorData({ ...professorData, first_name: e.target.value })}
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
                value={professorData.last_name}
                onChange={(e) => setProfessorData({ ...professorData, last_name: e.target.value })}
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
                options={sampleCourses}
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
}

// These customStyles would be similar in this page, add-professor, add-course and edit-professor pages
// After all the page is complete and merge, I will return and refactor the customStyles to a separate file.
const customStyles = {
  control: (provided: any, { isFocused }: any) => ({
    ...provided,
    borderColor: isFocused ? 'teal' : 'gray.200',
    borderWidth: isFocused ? '2px' : '1px',
    boxShadow: 'none',
    '&:hover': {
      borderColor: isFocused ? 'teal' : 'gray.200',
    },
    minHeight: '40px',
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: 'teal',
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: 'white',
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: 'white',
    ':hover': {
      backgroundColor: 'darkred',
      color: 'white',
    },
  }),
  option: (provided: any, { isSelected, isFocused }: any) => ({
    ...provided,
    backgroundColor: isSelected ? 'teal' : isFocused ? 'lightgray' : 'white',
    color: isSelected ? 'white' : 'black',
    ':active': {
      backgroundColor: 'teal',
      color: 'white',
    },
  }),
};
