// app/admin/manage/add-professor/page.tsx

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
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Select, { MultiValue } from 'react-select';

// ************************************************** SAMPLE DATA TO BE REMOVED WHEN BACKEND FINISH **************************************************
// Sample data for courses
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

// ******************************************************************************************************************************************************************
export default function AdminAddCourse() {
  const router = useRouter();
  const [selectedCourses, setSelectedCourses] = useState<{ value: string; label: string }[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here by adding this form to the database
    console.log({
      selectedCourses,
    });
  };

  const handleCancel = () => {
    router.push('/admin/manage');
  };

  const handleProfessorChange = (newValue: MultiValue<{ value: string; label: string }>) => {
    setSelectedCourses(newValue as { value: string; label: string }[]);
  };

  return (
    <Flex direction="column" align="center" justify="center" minHeight="100vh" bg="gray.50" p={5}>
      <Box width={{ base: '90%', sm: '500px' }} borderRadius="lg" shadow="md" bg="white" p={8}>
        <Heading as="h1" size="lg" mb={6} textAlign="center" color="teal">
          Add New Professor
        </Heading>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel htmlFor="professor-first-name" color="black">
                First Name:
              </FormLabel>
              <Input
                id="professor-first-name"
                placeholder="Enter professor first name"
                color="black"
                required
                focusBorderColor="#008080"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="professor-last-name" color="black">
                Last Name:
              </FormLabel>
              <Input
                id="professor-last-name"
                placeholder="Enter professor last name"
                color="black"
                required
                focusBorderColor="#008080"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="course-code" color="black">
                Select Courses:
              </FormLabel>
              <Select
                isMulti
                options={sampleCourses}
                value={selectedCourses}
                onChange={handleProfessorChange}
                placeholder="Select courses given by this professor..."
                styles={customStyles}
              />
            </FormControl>
            <Button type="submit" colorScheme="teal" color="white">
              Add Professor
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

// These customStyles would be similar in this page, add-course, edit-course and edit-professor pages
// After all the page is complete, I will return and refactor the customStyles to a separate file.
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
