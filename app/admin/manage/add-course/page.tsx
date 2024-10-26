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
// Sample data for professors and terms
const sampleProfessors = [
  { value: '1', label: 'Professor A' },
  { value: '2', label: 'Professor B' },
  { value: '3', label: 'Professor C' },
  { value: '4', label: 'Professor D' },
  { value: '5', label: 'Professor E' },
  { value: '6', label: 'Professor F' },
  { value: '7', label: 'Professor G' },
  { value: '8', label: 'Professor H' },
  { value: '9', label: 'Professor I' },
  { value: '10', label: 'Professor J' },
  // Add more professors as needed
];

const sampleTerms = [
  { value: 'Winter 2024', label: 'Winter 2024' },
  { value: 'Summer 2024', label: 'Summer 2024' },
  { value: 'Fall 2024', label: 'Fall 2024' },
  { value: 'Winter 2025', label: 'Winter 2025' },
  { value: 'Summer 2025', label: 'Summer 2025' },
  { value: 'Fall 2025', label: 'Fall 2025' },
  { value: 'Winter 2026', label: 'Winter 2026' },
  { value: 'Summer 2026', label: 'Summer 2026' },
  { value: 'Fall 2026', label: 'Fall 2026' },
];
// ******************************************************************************************************************************************************************
export default function AdminAddCourse() {
  const router = useRouter();
  const [selectedProfessors, setSelectedProfessors] = useState<{ value: string; label: string }[]>(
    []
  );
  const [selectedTerm, setSelectedTerm] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here by adding this form to the database
    console.log({
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
          Add New Course
        </Heading>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel htmlFor="course-name" color="black">
                Course Name:
              </FormLabel>
              <Input
                id="course-name"
                placeholder="Enter course name"
                color="black"
                required
                focusBorderColor="#008080"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="section-code" color="black">
                Section Code:
              </FormLabel>
              <Input
                id="section-code"
                placeholder="Enter section code"
                color="black"
                required
                focusBorderColor="#008080"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="professor-name" color="black">
                Select Professors:
              </FormLabel>
              <Select
                isMulti
                options={sampleProfessors}
                value={selectedProfessors}
                onChange={handleProfessorChange}
                placeholder="Select professors..."
                styles={customStyles}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="term" color="black">
                Select Term
              </FormLabel>
              <Select
                id="term"
                placeholder="Select term"
                onChange={(selectedOption) => setSelectedTerm(selectedOption?.value || '')}
                required
                options={sampleTerms}
                styles={customStyles}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="description" color="black">
                Description
              </FormLabel>
              <Textarea
                id="description"
                placeholder="Enter course description"
                color="black"
                required
                focusBorderColor="#008080"
              />
            </FormControl>
            <Button type="submit" colorScheme="teal" color="white">
              Add Course
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

// These customStyles would be similar in this page, add-professor, edit-course and edit-professor pages
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
