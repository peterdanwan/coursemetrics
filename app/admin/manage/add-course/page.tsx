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
import { useFlexStyle } from '@/styles/styles';

export default withAdminAuth(function AdminAddCourse({ user }: { user: any }) {
  const styles = useFlexStyle();
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
    value: professor.professor_id,
    label: `${professor.first_name} ${professor.last_name}`,
  }));

  const formattedDeliveryFormats = courseDeliveryFormats?.data?.courseDeliveryFormats?.map(
    (courseDelivery: any) => ({
      value: courseDelivery.course_delivery_format_id,
      label: courseDelivery.format,
    })
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    const courseData = {
      course_code: courseCode,
      name: courseName,
      course_section: courseSection,
      description: description,
      termSeason: selectedTermSeason,
      termYear: selectedTermYear,
      deliveryFormatId: selectedDeliveryFormat?.value,
      professorIds: selectedProfessors.map((prof) => prof.value),
    };

    //console.log('Course Data being sent:', JSON.stringify(courseData, null, 2));

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      const data = await response.json();
      console.log('Course created successfully:', data);
      router.push('/admin/manage');

      if (!response.ok) {
        throw new Error(data.error.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
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
    <Flex
      direction="column"
      align="center"
      justify="center"
      minHeight="100vh"
      bg={styles.bgColor}
      p={5}
    >
      <Box
        width={{ base: '90%', sm: '500px' }}
        borderRadius="lg"
        shadow="md"
        bg={styles.cardBg}
        p={8}
      >
        <Heading as="h1" size="lg" mb={6} textAlign="center" color={styles.headingColor}>
          Add New Course
        </Heading>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel htmlFor="course-name" color={styles.color}>
                Course Name:
              </FormLabel>
              <Input
                id="course-name"
                placeholder="Enter course name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                color={styles.color}
                required
                focusBorderColor={styles.hoverBg}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="section-code" color={styles.color}>
                Course Code:
              </FormLabel>
              <Input
                id="course-code"
                placeholder="Enter course code"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                color={styles.color}
                required
                focusBorderColor={styles.hoverBg}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="course-section" color={styles.color}>
                Course Section:
              </FormLabel>
              <Input
                id="section-code"
                placeholder="Enter course section"
                value={courseSection}
                onChange={(e) => setCourseSection(e.target.value)}
                color={styles.color}
                required
                focusBorderColor={styles.hoverBg}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="description" color={styles.color}>
                Description
              </FormLabel>
              <Textarea
                id="description"
                placeholder="Enter course description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                color={styles.color}
                required
                focusBorderColor={styles.hoverBg}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="term-season" color={styles.color}>
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
              <FormLabel htmlFor="term-year" color={styles.color}>
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
              <FormLabel htmlFor="delivery-format" color={styles.color}>
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
              <FormLabel htmlFor="professor-name" color={styles.color}>
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
