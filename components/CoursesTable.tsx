// components/CoursesTable.tsx
'use client';
import { Box, Flex, Stack, Text, Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

// We are passing the courses data from the admin/manage page so we don't have to
// specifically fetch courses data in this component
const CoursesTable: React.FC<{ courses: any[]; onRemove: (index: number) => void }> = ({
  courses,
  onRemove,
}) => {
  // More logic would need to be added here to remove the course from the database
  const router = useRouter();

  const displayedCourses = courses;
  // console.log('Displayed Courses: ', displayedCourses);

  if (!displayedCourses || displayedCourses.length === 0) {
    return <div>No courses available</div>;
  }

  const handleEditClick = (courseId: any) => {
    router.push(`/admin/manage/edit-course/${courseId}`);
  };

  //if (courseError) return <div>Failed to load courses</div>;
  if (!courses) return <div>Loading...</div>;

  return (
    <>
      {/* Table Header */}
      <Flex
        bg="gray.50"
        p={2}
        borderRadius="md"
        justify="space-between"
        fontWeight="bold"
        color="black"
        align="center"
      >
        <Text flex="1" textAlign="left">
          Course Name
        </Text>
        <Text flex="1" textAlign="left">
          Section
        </Text>
        <Text flex="1" textAlign="left">
          Term
        </Text>
        <Text flex="2" textAlign="left">
          Description
        </Text>
        <Text flex="1" textAlign="left">
          Options
        </Text>
      </Flex>

      {/* Scrollable Stack Container */}
      <Box
        mt={4}
        maxHeight="65vh"
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}
      >
        <Stack spacing={4}>
          {displayedCourses.map((course: any) => (
            <Box
              key={course.course_id}
              borderWidth="1px"
              borderRadius="lg"
              padding={4}
              bg="gray.50"
            >
              <Flex justify="space-between" align="center">
                <Text flex="1" color="black" m={1}>
                  {course.course_code}
                </Text>
                <Text color="black" flex="1" m={1}>
                  {course.course_section}
                </Text>
                <Text color="black" flex="1" m={1}>
                  {course.CourseTerm.season} {course.CourseTerm.year}
                </Text>
                <Text color="black" flex="2" isTruncated m={1}>
                  {course.CourseDetail.course_description}
                </Text>
                <Flex
                  flexDirection={{ base: 'column', md: 'row' }}
                  justifyContent="space-between"
                  m={1}
                  gap={4}
                  flex="1"
                >
                  <Button
                    colorScheme="teal"
                    flex="1"
                    mr={{ base: 0, md: 1 }}
                    mb={{ base: 1, md: 0 }}
                    onClick={() => handleEditClick(course.course_id)}
                  >
                    Edit
                  </Button>
                  <Button
                    colorScheme="teal"
                    flex="1"
                    ml={{ base: 0, md: 1 }}
                    onClick={() => onRemove(course.course_id)}
                  >
                    Remove
                  </Button>
                </Flex>
              </Flex>
            </Box>
          ))}
        </Stack>
      </Box>
    </>
  );
};

export default CoursesTable;
