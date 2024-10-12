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
import ProfessorsTable from '@/components/ProfessorsTable'; // Import the new component
import ReviewsTable from '@/components/ReviewsTable'; // Import the new component

// ************************************************** SAMPLE DATA TO BE REMOVED WHEN BACKEND FINISH **************************************************
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
];

const initialProfessors = [
  {
    first_name: 'John',
    last_name: 'Doe',
  },
  {
    first_name: 'Jane',
    last_name: 'Smith',
  },
  {
    first_name: 'Emily',
    last_name: 'Johnson',
  },
  {
    first_name: 'Michael',
    last_name: 'Brown',
  },
  {
    first_name: 'Sarah',
    last_name: 'Davis',
  },
  {
    first_name: 'John',
    last_name: 'Doe',
  },
  {
    first_name: 'Jane',
    last_name: 'Smith',
  },
  {
    first_name: 'Emily',
    last_name: 'Johnson',
  },
  {
    first_name: 'Michael',
    last_name: 'Brown',
  },
  {
    first_name: 'Sarah',
    last_name: 'Davis',
  },
];

const reviews = [
  {
    category: 'Course Review',
    course_code: 'CSC101',
    review_text:
      'This course provides a solid introduction to computer science, with a focus on programming fundamentals. Highly recommended for beginners!',
    average_rate: 4.5,
    status: 'approved',
  },
  {
    category: 'Course Review',
    course_code: 'MTH202',
    review_text:
      'The content was quite challenging, but the professor was very helpful. I struggled with some concepts, but overall, it was a good learning experience.',
    average_rate: 3.8,
    status: 'pending',
  },
  {
    category: 'Professor Review',
    course_code: 'PHY303',
    review_text:
      'Professor Smith explains difficult concepts clearly and is always available to answer questions. However, the exams were much harder than expected.',
    average_rate: 4.2,
    status: 'approved',
  },
  {
    category: 'Course Review',
    course_code: 'ENG104',
    review_text:
      'I didn’t enjoy the lectures, but the assignments were interesting. The course material felt outdated, and there was little class interaction.',
    average_rate: 2.5,
    status: 'rejected',
  },
  {
    category: 'Professor Review',
    course_code: 'CHE201',
    review_text:
      'Dr. Thompson is a brilliant professor but can be very strict. If you want to succeed in this class, you need to work hard and follow all the guidelines.',
    average_rate: 4.0,
    status: 'pending',
  },
  {
    category: 'Course Review',
    course_code: 'CSC101',
    review_text:
      'This course provides a solid introduction to computer science, with a focus on programming fundamentals. Highly recommended for beginners!',
    average_rate: 4.5,
    status: 'approved',
  },
  {
    category: 'Course Review',
    course_code: 'MTH202',
    review_text:
      'The content was quite challenging, but the professor was very helpful. I struggled with some concepts, but overall, it was a good learning experience.',
    average_rate: 3.8,
    status: 'pending',
  },
];
// ******************************************************************************************************************************************************************

export default function Manage() {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [professors, setProfessors] = useState(initialProfessors);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const removeProfessor = (index: number) => {
    // More logic would need to be added here to remove the course from the database
    setProfessors((prevProfessors) => prevProfessors.filter((_, i) => i !== index));
  };

  // ************************************************** FILTER SAMPLE DATA TO BE CHANGED WITH DB DATA **************************************************

  // Function to filter courses based on search value
  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      course.section.toLowerCase().includes(searchValue.toLowerCase()) ||
      course.term.toLowerCase().includes(searchValue.toLowerCase()) ||
      course.description.toLowerCase().includes(searchValue.toLowerCase())
  );

  const filteredProfessors = professors.filter((professor) => {
    const fullName = `${professor.first_name} ${professor.last_name}`.toLowerCase();
    return (
      professor.first_name.toLowerCase().includes(searchValue.toLowerCase()) ||
      professor.last_name.toLowerCase().includes(searchValue.toLowerCase()) ||
      fullName.includes(searchValue.toLowerCase())
    );
  });

  // Function to filter reviews based on search value
  const filteredReviews = reviews.filter((review) => {
    const normalizedRate = review.average_rate.toFixed(1); // Keep one decimal place
    return (
      review.review_text.toLowerCase().includes(searchValue.toLowerCase()) ||
      review.category.toLowerCase().includes(searchValue.toLowerCase()) ||
      review.course_code.toLowerCase().includes(searchValue.toLowerCase()) ||
      review.status.toLowerCase().includes(searchValue.toLowerCase()) ||
      normalizedRate.includes(searchValue)
    );
  });

  // ******************************************************************************************************************************************************************

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
        <Button colorScheme="teal" color="white" px={6}>
          Add
        </Button>
      </Flex>

      <Divider mb={4} />
      {/* Conditionally render appropriate category when it is selected */}
      {selectedOption === 'courses' && <CoursesTable courses={filteredCourses} />}
      {selectedOption === 'professors' && (
        <ProfessorsTable professors={filteredProfessors} onRemove={removeProfessor} />
      )}
      {selectedOption === 'reviews' && <ReviewsTable reviews={filteredReviews} />}
    </Box>
  );
}
