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
  Button,
  Select,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useFlexStyle } from '@/styles/styles';

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
  courses: ICourse[];
}

export default function CourseCard({ courses }: CourseCardProps) {
  const flexStyle = useFlexStyle();
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState<ICourse>(courses[0]);
  const [selectedTermId, setSelectedTermId] = useState('');

  const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const termId = e.target.value;
    setSelectedTermId(termId);

    if (termId === '') {
      setSelectedCourse(courses[0]);
    } else {
      const newSelectedCourse = courses.find((course) => course.course_term_id === Number(termId));
      if (newSelectedCourse) {
        setSelectedCourse(newSelectedCourse);
      }
    }
  };

  const uniqueCourseTerms = new Set(courses.map((course) => course.course_term_id));

  const navigateToCourse = () => {
    if (selectedTermId === '') {
      const mostRecentCourse = courses.reduce(
        (latest, current) => {
          if (!latest) return current;
          const latestDate = new Date(`${latest.CourseTerm.year}-${latest.CourseTerm.season}`);
          const currentDate = new Date(`${current.CourseTerm.year}-${current.CourseTerm.season}`);
          return currentDate > latestDate ? current : latest;
        },
        null as ICourse | null
      );

      if (mostRecentCourse) {
        router.push(`/courses/${mostRecentCourse.course_code}`);
      }
    } else {
      router.push(
        `/courses/${selectedCourse.course_code}?season=${selectedCourse.CourseTerm.season}&year=${selectedCourse.CourseTerm.year}`
      );
    }
  };

  return (
    <Card bgColor={flexStyle.cardBg} border={flexStyle.borderColor} borderWidth={1}>
      <CardHeader p={{ base: '3', sm: '3', md: '3' }}>
        <Flex align="start" gap={2} direction="column">
          <Box>
            <Link href={`/courses/${selectedCourse.course_code}`}>
              <Heading
                as="h1"
                color={flexStyle.headingColor}
                fontSize={{ base: '20', sm: '24', md: '24', lg: '28' }}
                mb={2}
              >
                {selectedCourse.course_code}
              </Heading>
            </Link>
            <Heading as="h2" color={flexStyle.headingColor} fontSize={{ md: '18' }}>
              {selectedCourse.CourseDetail.course_name}
            </Heading>
          </Box>
          <Box width="100%" maxW="150px">
            <Select
              placeholder="Select Term"
              size="sm"
              onChange={handleTermChange}
              value={selectedTermId}
              borderColor={flexStyle.borderColor}
              focusBorderColor={flexStyle.headingColor}
              borderRadius="md"
            >
              {Array.from(uniqueCourseTerms).map((termId) => {
                const course = courses.find((c) => c.course_term_id === termId);
                if (!course) return null;
                return (
                  <option key={course.course_id} value={course.course_term_id}>
                    {course.CourseTerm.season} {course.CourseTerm.year}
                  </option>
                );
              })}
            </Select>
          </Box>
        </Flex>
      </CardHeader>
      <CardBody p={{ base: '3', sm: '3', md: '3' }}>
        <Text fontSize={{ md: '14' }} color={flexStyle.color} noOfLines={1}>
          {selectedCourse.CourseDetail.course_description}
        </Text>
      </CardBody>
      <Button colorScheme="teal" size="sm" onClick={navigateToCourse} mt={2}>
        View Reviews
      </Button>
    </Card>
  );
}
