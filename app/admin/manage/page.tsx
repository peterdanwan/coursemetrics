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
} from '@chakra-ui/react';
import { useState } from 'react';
import CoursesTable from '@/components/CoursesTable'; // Import the new component

// Sample data for courses
const courses = [
  {
    name: 'Course 1',
    section: 'A',
    term: 'Fall 2024',
    description: 'Introductory course to programming.',
  },
  {
    name: 'Course 2',
    section: 'B',
    term: 'Spring 2024',
    description: 'Advanced topics in software development.',
  },
  {
    name: 'Course 3',
    section: 'C',
    term: 'Winter 2024',
    description: 'Data Structures and Algorithms.',
  },
  {
    name: 'Course 4',
    section: 'D',
    term: 'Summer 2024',
    description: 'Web Development Fundamentals.',
  },
  {
    name: 'Course 5',
    section: 'A',
    term: 'Fall 2024',
    description:
      'Introductory course to programming. This is a longer description that should be truncated if it exceeds the available space.',
  },
  {
    name: 'Course 6',
    section: 'B',
    term: 'Spring 2024',
    description: 'Advanced topics in software development.',
  },
  {
    name: 'Course 7',
    section: 'C',
    term: 'Winter 2024',
    description:
      'Data Structures and Algorithms. This course will cover advanced topics and practical applications.',
  },
  // Add more courses as needed
];

export default function Manage() {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  // Function to filter courses based on search value
  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchValue.toLowerCase()) || // Search by course name
      course.section.toLowerCase().includes(searchValue.toLowerCase()) || // Search by section
      course.term.toLowerCase().includes(searchValue.toLowerCase()) || // Search by term
      course.description.toLowerCase().includes(searchValue.toLowerCase()) // Search by description
  );

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
        <Button colorScheme="green" color="white" px={6}>
          Add
        </Button>
      </Flex>

      <Divider mb={4} />
      {/* Conditionally render the CoursesTable when "courses" is selected */}
      {selectedOption === 'courses' && <CoursesTable courses={courses} />}
    </Box>
  );
}
