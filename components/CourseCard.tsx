import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Box,
  Text,
  Flex,
  Spacer,
  Button,
  Select,
} from '@chakra-ui/react';
import { FaHeart } from 'react-icons/fa';

interface ICourseTerm {
  season: string;
  year: number;
}

interface ICourseDetail {
  course_name: string;
  course_description: string;
}

interface ICourse {
  course_id: number;
  course_code: string;
  course_term_id: number;
  CourseDetail: ICourseDetail;
  CourseTerm: ICourseTerm;
}

interface CourseCardProps {
  courses: ICourse[]; // Array of courses for the same course_code
}

export default function CourseCard({ courses }: CourseCardProps) {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState<ICourse>(courses[0]);

  const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTermId = Number(e.target.value);
    const newSelectedCourse = courses.find((course) => course.course_term_id === selectedTermId);
    if (newSelectedCourse) {
      setSelectedCourse(newSelectedCourse);
    }
  };

  const navigateToCourse = () => {
    router.push(
      `/courses/${selectedCourse.course_code}?season=${selectedCourse.CourseTerm.season}&year=${selectedCourse.CourseTerm.year}`
    );
  };

  return (
    <Card>
      <CardHeader p={{ base: '3', sm: '3', md: '3' }}>
        <Flex align="center" gap={2} wrap="wrap">
          <Box>
            <Heading
              as="h1"
              color="teal"
              fontSize={{ base: '20', sm: '24', md: '24', lg: '28' }}
              mb={2}
            >
              {selectedCourse.course_code}
            </Heading>
            <Heading as="h2" color="teal" fontSize={{ md: '18' }}>
              {selectedCourse.CourseDetail.course_name}
            </Heading>
          </Box>
          <Spacer />
          <Box color="pink.400">
            <FaHeart size={20} />
          </Box>
          <Box>
            <Select
              placeholder="Select Term"
              size="sm"
              onChange={handleTermChange}
              defaultValue={selectedCourse.course_term_id}
            >
              {courses.map((course) => (
                <option key={course.course_id} value={course.course_term_id}>
                  {course.CourseTerm.season} {course.CourseTerm.year}
                </option>
              ))}
            </Select>
          </Box>
        </Flex>
      </CardHeader>
      <CardBody p={{ base: '3', sm: '3', md: '3' }}>
        <Text fontSize={{ md: '14' }}>{selectedCourse.CourseDetail.course_description}</Text>
      </CardBody>
      <Button colorScheme="teal" variant="outline" size="sm" onClick={navigateToCourse} mt={2}>
        View Reviews
      </Button>
    </Card>
  );
}
