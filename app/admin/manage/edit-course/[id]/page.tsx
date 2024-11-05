// app/admin/manage/edit-course/[id]/page.tsx
'use client';
// Backend not done here yet
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

export default withAdminAuth(function EditCourse({ user }: { user: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('id');
  const { data: courseData, error: courseError } = useSWR(
    courseId ? `/api/courses/${courseId}` : null, // Fetch only if courseId exists
    apiFetcher
  );
  console.log('Course Data Edit Page:', courseData);

  // Error handling for courses
  if (courseError) return <div>Failed to load data</div>;
  if (!courseData) return <div>Loading...</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the update course logic here
    console.log('Course Data:', courseData);
  };

  const handleCancel = () => {
    router.push('/admin/manage?option=courses');
  };

  // const handleProfessorChange = (newValue: MultiValue<{ value: string; label: string }>) => {
  //   setSelectedProfessors(newValue as { value: string; label: string }[]);
  // };

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
                // onChange={(e) => setCourseData({ ...courseData, name: e.target.value })}
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
                // onChange={(e) => setCourseData({ ...courseData, section: e.target.value })}
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
                // options={sampleProfessors}
                // value={selectedProfessors}
                // onChange={handleProfessorChange}
                styles={customStyles}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="term" color="black">
                Select Term
              </FormLabel>
              <Select
                // options={sampleTerms}
                // value={{ value: selectedTerm, label: selectedTerm }}
                // onChange={(option) => setSelectedTerm(option?.value || '')}
                styles={customStyles}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="description" color="black">
                Description
              </FormLabel>
              <Textarea
                value={courseData.description}
                // onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
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
