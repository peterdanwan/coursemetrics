// app/admin/manage/add-course/page.tsx
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
  Text,
  useToast,
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
  const toast = useToast();

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
      course_section: courseSection,
      course_detail: {
        course_name: courseName,
        course_description: description,
      },
      course_term: {
        season: selectedTermSeason,
        year: parseInt(selectedTermYear, 10),
      },
      course_delivery_format_id: selectedDeliveryFormat?.value,
      professors: selectedProfessors.map((prof) => ({
        professor_id: parseInt(prof.value, 10),
      })),
    };

    console.log('Course Data being sent:', JSON.stringify(courseData, null, 2));

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      if (response.status === 409) {
        const result = await response.json();
        // Show a toast to the user
        toast({
          title: 'Course Already Exists',
          description: result.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }

      const data = await response.json();
      console.log('Course created successfully:', data);
      toast({
        title: 'Course successfully created',
        description: `The course ${courseData.course_code} has been successfully created.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      router.push('/admin/manage?option=courses');

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
    router.push('/admin/manage?option=courses');
  };

  const handleProfessorChange = (newValue: MultiValue<{ value: string; label: string }>) => {
    const professorsWithIds = newValue.map((prof) => ({
      value: prof.value,
      label: prof.label,
      professor_id: parseInt(prof.value, 10),
    }));

    setSelectedProfessors(professorsWithIds);
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
                Course Name:{' '}
                <Text as="span" color={styles.requiredColor} fontSize="sm">
                  (Required)
                </Text>
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
                Course Code:{' '}
                <Text as="span" color={styles.requiredColor} fontSize="sm">
                  (Required)
                </Text>
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
                Course Section:{' '}
                <Text as="span" color={styles.requiredColor} fontSize="sm">
                  (Required)
                </Text>
              </FormLabel>
              <Input
                id="section-section"
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
                Description{' '}
                <Text as="span" color={styles.requiredColor} fontSize="sm">
                  (Required)
                </Text>
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
                Select Term Season{' '}
                <Text as="span" color={styles.requiredColor} fontSize="sm">
                  (Required)
                </Text>
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
                Select Term Year{' '}
                <Text as="span" color={styles.requiredColor} fontSize="sm">
                  (Required)
                </Text>
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
                Select Delivery Format{' '}
                <Text as="span" color={styles.requiredColor} fontSize="sm">
                  (Required)
                </Text>
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
                Select Professors:{' '}
                <Text as="span" color={styles.requiredColor} fontSize="sm">
                  (Optional)
                </Text>
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
              {isSubmitting ? 'Submitting...' : 'Add Course'}
            </Button>
            <Button type="button" onClick={handleCancel} colorScheme="gray">
              Cancel
            </Button>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
});
