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
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Select, { MultiValue } from 'react-select';
import withAdminAuth from '@/components/withAdminAuth';
import customStyles from '@/styles/customStyles';
import { apiFetcher } from '@/utils';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import { useFlexStyle } from '@/styles/styles';

export default withAdminAuth(function EditCourse({ user }: { user: any }) {
  const styles = useFlexStyle();
  const router = useRouter();
  const { id: courseId } = useParams();

  const { data: coursesID, error: courseError } = useSWR(`/api/courses/id/${courseId}`, apiFetcher);
  const { data: professorData, error: professorError } = useSWR('/api/professors', apiFetcher);
  const { data: courseDeliveryFormats, error: courseDeliveryFormatsError } = useSWR(
    '/api/courses/courseDelivery',
    apiFetcher
  );

  //console.log('Course Data Edit Page:', coursesID);
  //console.log('Professor Data Edit Page:', professorData);
  //console.log('Delivery Formats Edit Page:', courseDeliveryFormats);

  // Data formatting for select options
  const termSeasons = ['Summer', 'Spring', 'Winter', 'Fall'];
  const years = Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => 1900 + i);

  // Map options for delivery formats
  const formattedDeliveryFormats = courseDeliveryFormats?.data?.courseDeliveryFormats?.map(
    (format: any) => ({
      value: format.course_delivery_format_id,
      label: format.format,
    })
  );

  // Map options for professors
  const formattedProfessors = professorData?.data?.professors?.map((professor: any) => ({
    value: professor.professor_id,
    label: `${professor.first_name} ${professor.last_name}`,
  }));

  const [formValues, setFormValues] = useState<any>({
    courseName: '',
    courseCode: '',
    courseSection: '',
    description: '',
    termSeason: null,
    termYear: null,
    deliveryFormat: null,
    professors: [],
  });

  useEffect(() => {
    if (coursesID && professorData && courseDeliveryFormats) {
      const course = coursesID?.data?.course;

      setFormValues({
        courseName: course?.CourseDetail?.course_name || '',
        courseCode: course?.course_code || '',
        courseSection: course?.course_section || '',
        description: course?.CourseDetail?.course_description || '',
        termSeason: {
          value: course?.CourseTerm?.season || '',
          label: course?.CourseTerm?.season || '',
        },
        termYear: {
          value: course?.CourseTerm?.year?.toString() || '',
          label: course?.CourseTerm?.year?.toString() || '',
        },
        deliveryFormat: {
          value: course?.CourseDeliveryFormat?.course_delivery_format_id || '',
          label: course?.CourseDeliveryFormat?.format || '',
        },
        professors:
          course?.ProfessorCourses?.map((prof: any) => ({
            value: prof.professor_id,
            label: `${prof.Professor.first_name} ${prof.Professor.last_name}`,
          })) || [],
      });
    }
  }, [coursesID, professorData, courseDeliveryFormats]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Data to be sent:', formValues);

    const updatedCourseData = {
      course_id: courseId,
      course_code: formValues.courseCode,
      name: formValues.courseName,
      description: formValues.description,
      course_section: formValues.courseSection,
      termSeason: formValues.termSeason.value,
      termYear: formValues.termYear.value,
      deliveryFormatId: formValues.deliveryFormat.value,
      professorIds: formValues.professors.map((professor: any) => professor.value),
    };

    try {
      const response = await fetch(`/api/courses/id/${courseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCourseData),
      });

      const data = await response.json();
      console.log('Course updated successfully:', data);
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

  // Error handling for courses
  if (courseError || professorError || courseDeliveryFormatsError)
    return <div>Failed to load data</div>;
  if (!coursesID || !professorData || !courseDeliveryFormats) return <div>Loading...</div>;

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
          Edit Course
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
                value={formValues.courseName}
                onChange={(e) => setFormValues({ ...formValues, courseName: e.target.value })}
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
                value={formValues.courseCode}
                onChange={(e) => setFormValues({ ...formValues, courseCode: e.target.value })}
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
                value={formValues.courseSection}
                onChange={(e) => setFormValues({ ...formValues, courseSection: e.target.value })}
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
                value={formValues.description}
                onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
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
                value={formValues.termSeason}
                options={termSeasons.map((season) => ({ value: season, label: season }))}
                onChange={(selectedOption) =>
                  setFormValues({ ...formValues, termSeason: selectedOption })
                }
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
                value={formValues.termYear}
                options={years.map((year) => ({ value: year.toString(), label: year.toString() }))}
                onChange={(selectedOption) =>
                  setFormValues({ ...formValues, termYear: selectedOption })
                }
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
                value={formValues.deliveryFormat}
                options={formattedDeliveryFormats}
                onChange={(selectedOption) =>
                  setFormValues({ ...formValues, deliveryFormat: selectedOption })
                }
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
                id="professor-name"
                value={formValues.professors}
                options={formattedProfessors}
                onChange={(selectedOptions: MultiValue<any>) =>
                  setFormValues({ ...formValues, professors: selectedOptions })
                }
                required
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
              Edit Course
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
