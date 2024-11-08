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
import { useState, useEffect } from 'react';
import Select, { MultiValue } from 'react-select';
import withAdminAuth from '@/components/withAdminAuth';
import customStyles from '@/styles/customStyles';
import { apiFetcher } from '@/utils';
import useSWR from 'swr';

/* I need th POST API to be able to post something like the following JSON:
{
  "status": "ok",
  "data": {
    "course": {
      "course_id": 1,
      "course_code": "WEB222",
      "course_detail_id": 1,
      "course_term_id": 1,
      "course_section": "NAA",
      "course_delivery_format_id": 1,
      "createdAt": "2024-11-08T00:53:42.901Z",
      "updatedAt": "2024-11-08T00:53:42.901Z",
      "CourseDetail": {
        "course_name": "Introduction to Web Programming",
        "course_description": "Learn HTML, JS, and CSS to build modern web applications."
      },
      "CourseTerm": {
        "season": "Fall",
        "year": 2023
      },
      "CourseDeliveryFormat": {
        "format": "Online Async",
        "description": "Students learn remotely and are not required to come to campus. No scheduled class time and learning is independent."
      },
      "ProfessorCourses": [
        {
          "professor_course_id": 1,
          "professor_id": 1,
          "course_id": 1,
          "createdAt": "2024-11-08T00:53:42.913Z",
          "updatedAt": "2024-11-08T00:53:42.913Z",
          "Professor": {
            "professor_id": 1,
            "first_name": "Alice",
            "last_name": "Johnson"
          }
        }
      ]
    }
  }
}
*/

export default withAdminAuth(function AdminAddCourse({ user }: { user: any }) {
  const router = useRouter();
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseSection, setCourseSection] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTermSeason, setSelectedTermSeason] = useState('');
  const [selectedTermYear, setSelectedTermYear] = useState('');
  const [selectedDeliveryFormat, setSelectedDeliveryFormat] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [selectedProfessors, setSelectedProfessors] = useState<{ value: string; label: string }[]>(
    []
  );

  // Generate the list of years from 1900 to the current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => 1900 + i);

  // API Fetch
  const { data: professorData, error: professorError } = useSWR('/api/professors', apiFetcher);
  const { data: courseDeliveryFormats, error: courseDeliveryFormatsError } = useSWR(
    '/api/courses/courseDelivery',
    apiFetcher
  );

  const formattedProfessors = professorData?.data?.professors?.map((professor: any) => ({
    value: professor.professor_id, // Assuming `professor_id` is the value you want to use
    label: `${professor.first_name} ${professor.last_name}`, // Concatenate first and last name
  }));

  const formattedDeliveryFormats = courseDeliveryFormats?.data?.courseDeliveryFormats?.map(
    (courseDelivery: any) => ({
      value: courseDelivery.course_delivery_format_id, // Assuming `course_delivery_format_id` is the value you want to use
      label: courseDelivery.format, // Assuming `format` is the label
    })
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    // Prepare the data in the desired structure
    const courseData = {
      course_code: courseCode, // Assuming sectionCode is the course code
      name: courseName,
      course_section: courseSection,
      description: description,
      termSeason: selectedTermSeason,
      termYear: selectedTermYear,
      deliveryFormatId: selectedDeliveryFormat?.value, // Assuming you are passing the id from selected delivery format
      professorIds: selectedProfessors.map((prof) => prof.value), // Assuming the selected professors are an array of { value, label }
    };

    // You can log the courseData here to check what is being sent
    console.log('Course Data being sent:', JSON.stringify(courseData, null, 2));

    // POST API
    try {
      // Make the POST request to the backend API
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData), // Send the course data as a JSON string
      });

      if (response.ok) {
        // If the response is successful (status 200)
        const data = await response.json();
        console.log('Course created successfully:', data);

        // Optionally, redirect to another page or show a success message
        router.push('/admin/manage'); // Redirect to the manage courses page
      } else {
        // Handle errors (e.g., invalid data, server errors)
        const errorData = await response.json();
        console.error('Error creating course:', errorData);
        alert('Error creating course: ' + errorData.message);
      }
    } catch (error) {
      // Handle network errors or unexpected issues
      console.error('Error during API call:', error);
      alert('An error occurred while creating the course.');
    } finally {
      // Reset the submitting state
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/manage');
  };

  const handleProfessorChange = (newValue: MultiValue<{ value: string; label: string }>) => {
    setSelectedProfessors(newValue as { value: string; label: string }[]);
  };

  if (professorError || courseDeliveryFormatsError) return <div>Failed to load data</div>;
  if (!professorData || !courseDeliveryFormats) return <div>Loading...</div>;

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
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                color="black"
                required
                focusBorderColor="#008080"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="section-code" color="black">
                Course Code:
              </FormLabel>
              <Input
                id="course-code"
                placeholder="Enter course code"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                color="black"
                required
                focusBorderColor="#008080"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="course-section" color="black">
                Course Section:
              </FormLabel>
              <Input
                id="section-code"
                placeholder="Enter course section"
                value={courseSection}
                onChange={(e) => setCourseSection(e.target.value)}
                color="black"
                required
                focusBorderColor="#008080"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="description" color="black">
                Description
              </FormLabel>
              <Textarea
                id="description"
                placeholder="Enter course description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                color="black"
                required
                focusBorderColor="#008080"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="term-season" color="black">
                Select Term Season
              </FormLabel>
              <Select
                id="term-season"
                value={{ value: selectedTermSeason, label: selectedTermSeason }}
                onChange={(selectedOption) => setSelectedTermSeason(selectedOption?.value || '')}
                options={[
                  { value: 'Summer', label: 'Summer' },
                  { value: 'Spring', label: 'Spring' },
                  { value: 'Winter', label: 'Winter' },
                  { value: 'Fall', label: 'Fall' },
                ]}
                required
                placeholder="Select term season"
                styles={customStyles}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="term-year" color="black">
                Select Term Year
              </FormLabel>
              <Select
                id="term-year"
                value={{ value: selectedTermYear, label: selectedTermYear }}
                onChange={(selectedOption) => setSelectedTermYear(selectedOption?.value || '')}
                options={years.map((year) => ({ value: year.toString(), label: year.toString() }))}
                required
                placeholder="Select term year"
                styles={customStyles}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="delivery-format" color="black">
                Select Delivery Format
              </FormLabel>
              <Select
                id="delivery-format"
                value={selectedDeliveryFormat}
                onChange={(selectedOption) => setSelectedDeliveryFormat(selectedOption)}
                options={formattedDeliveryFormats || []}
                required
                placeholder="Select delivery format"
                styles={customStyles}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="professor-name" color="black">
                Select Professors:
              </FormLabel>
              <Select
                isMulti
                options={formattedProfessors || []}
                value={selectedProfessors}
                onChange={handleProfessorChange}
                placeholder="Select professors..."
                styles={customStyles}
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="teal"
              color="white"
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            >
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
});
