// components/CoursesTable.tsx
import { Box, Flex, Stack, Text, Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

// Define the Course type
type Course = {
  id: string;
  name: string;
  section: string;
  term: string;
  description: string;
};

// Props interface
interface CoursesTableProps {
  courses: Course[];
  onRemove: (index: number) => void;
}

const CoursesTable: React.FC<CoursesTableProps> = ({ courses, onRemove }) => {
  // More logic would need to be added here to remove the course from the database
  const router = useRouter();

  const handleEditClick = (courseId: string) => {
    router.push(`/admin/manage/edit-course/${courseId}`);
  };
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
        p={2}
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
          {courses.map((course, index) => (
            <Box key={index} borderWidth="1px" borderRadius="lg" padding={4} bg="gray.50">
              <Flex justify="space-between" align="center">
                <Text flex="1" color="black" m={1}>
                  {course.name}
                </Text>
                <Text color="black" flex="1" m={1}>
                  {course.section}
                </Text>
                <Text color="black" flex="1" m={1}>
                  {course.term}
                </Text>
                <Text color="black" flex="2" isTruncated m={1}>
                  {course.description}
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
                    color="white"
                    flex="1"
                    mr={{ base: 0, md: 1 }}
                    mb={{ base: 1, md: 0 }}
                    onClick={() => handleEditClick(course.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    colorScheme="teal"
                    color="white"
                    flex="1"
                    ml={{ base: 0, md: 1 }}
                    onClick={() => onRemove(index)}
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
