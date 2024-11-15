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
  IconButton,
} from '@chakra-ui/react';
import { CiBookmark } from 'react-icons/ci';
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
  courses: ICourse[]; // Array of courses for the same course_code
}

export default function CourseCard({ courses }: CourseCardProps) {
  const flexStyle = useFlexStyle();
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState<ICourse>(courses[0]);
  const [selectedTermId, setSelectedTermId] = useState(''); // Track selected term ID

  const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const termId = e.target.value;
    setSelectedTermId(termId);

    if (termId === '') {
      // No term selected; you might choose to reset selectedCourse or keep it unchanged
      setSelectedCourse(courses[0]); // Reset to default course or handle as needed
    } else {
      const newSelectedCourse = courses.find((course) => course.course_term_id === Number(termId));
      if (newSelectedCourse) {
        setSelectedCourse(newSelectedCourse);
      }
    }
  };

  // const navigateToCourse = () => {
  //   if (selectedTermId === '') {
  //     // No term selected; navigate without query parameters
  //     router.push(`/courses/${selectedCourse.course_code}`);
  //   } else {
  //     router.push(
  //       `/courses/${selectedCourse.course_code}?season=${selectedCourse.CourseTerm.season}&year=${selectedCourse.CourseTerm.year}`
  //     );
  //   }
  // };

  const navigateToCourse = () => {
    if (selectedTermId === '') {
      // Get the most recent term's course
      const mostRecentCourse = courses.reduce((latest, current) => {
        if (!latest) return current;
        const latestDate = new Date(`${latest.CourseTerm.year}-${latest.CourseTerm.season}`);
        const currentDate = new Date(`${current.CourseTerm.year}-${current.CourseTerm.season}`);
        return currentDate > latestDate ? current : latest;
      }, null as ICourse | null);

      if (mostRecentCourse) {
        router.push(`/courses/${mostRecentCourse.course_code}`);
      }
    } else {
      router.push(
        `/courses/${selectedCourse.course_code}?season=${selectedCourse.CourseTerm.season}&year=${selectedCourse.CourseTerm.year}`
      );
    }
  };

  // May remove this bookmark from here and only have it on the views instead
  // const handleBookmark = () => {
  //   alert('Bookmark clicked - Still in development');
  // };

  return (
    <Card bgColor={flexStyle.cardBg} border={flexStyle.borderColor} borderWidth={1}>
      <CardHeader p={{ base: '3', sm: '3', md: '3' }}>
        <Flex align="center" gap={2} wrap="wrap">
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
          <Spacer />
          {/* <Box color="pink.400">
            <IconButton aria-label="Bookmark" variant="outline" onClick={handleBookmark}>
              <CiBookmark size={20} />
            </IconButton>
          </Box> */}
          <Box>
            <Select
              placeholder="Select Term"
              size="sm"
              onChange={handleTermChange}
              value={selectedTermId}
              borderColor={flexStyle.borderColor}
              focusBorderColor={flexStyle.headingColor}
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
        <Text fontSize={{ md: '14' }} color={flexStyle.color}>
          {selectedCourse.CourseDetail.course_description}
        </Text>
      </CardBody>
      <Button colorScheme="teal" size="sm" onClick={navigateToCourse} mt={2}>
        View Reviews
      </Button>
    </Card>
  );
}
