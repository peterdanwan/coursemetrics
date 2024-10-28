// app/courses/page.tsx

'use client';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import {
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Box,
  Text,
  Flex,
  Spacer,
  Button,
} from '@chakra-ui/react';
import { FaHeart } from 'react-icons/fa';
import { apiFetcher } from '@/utils';
import { useSearchParams } from 'next/navigation';

interface ICourseTerm {
  course_term_id: number;
  season: string;
  year: number;
  createdAt: string;
  updatedAt: string;
}

interface ICourseDetail {
  course_name: string;
  course_description: string;
}

interface ICourse {
  course_id: number;
  course_code: string;
  CourseDetail: ICourseDetail;
  course_term_id: number;
  course_section: string;
  course_delivery_format_id: number;
  createdAt: string;
  updatedAt: string;
  CourseTerm: ICourseTerm;
}

function getURL(page: string | null, limit: string | null) {
  let url: string;

  if (page && limit) {
    url = `/api/courses/page=${page}&limit=${limit}`;
  } else if (page) {
    url = `/api/courses/page=${page}`;
  } else if (limit) {
    url = `/api/courses/limit=${limit}`;
  } else {
    url = `/api/courses`;
  }

  return url;
}

export default function CoursesPage() {
  const searchParams = useSearchParams();

  const router = useRouter();
  const [courses, setCourses] = useState<ICourse[]>([]);

  const page = searchParams.get('page') || null;
  const limit = searchParams.get('limit') || null;
  const coursesURL = getURL(page, limit);

  const { data: coursesResponse, error } = useSWR(coursesURL, apiFetcher);

  useEffect(() => {
    if (coursesResponse) {
      setCourses(coursesResponse.data.courses);
    }
  }, [coursesResponse]);

  const navigateToCourse = (courseCode: string) => {
    router.push(`/courses/${courseCode}`);
  };

  return (
    <Grid
      gridTemplateColumns="repeat(12, 1fr)"
      gap={{ base: '3', md: '3', lg: '6' }}
      p={{ base: '3', md: '3', lg: '5' }}
      margin="0 auto"
      w={{ base: '100%', '2xl': '80%' }}
      bgColor={'gray.100'}
    >
      {courses.length > 0 ? (
        courses.map((course) => (
          <GridItem
            key={course.course_id}
            gridColumn={{ base: 'span 12', md: 'span 6', lg: 'span 4' }}
          >
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
                      {course.course_code}
                    </Heading>
                    <Heading as="h2" color="teal" fontSize={{ md: '18' }}>
                      {course.CourseDetail.course_name}
                    </Heading>
                  </Box>
                  <Spacer />
                  <Box color="pink.400">
                    <FaHeart size={20} />
                  </Box>
                </Flex>
              </CardHeader>
              <CardBody p={{ base: '3', sm: '3', md: '3' }}>
                <Text fontSize={{ md: '14' }}>{course.CourseDetail.course_description}</Text>
              </CardBody>
              <Button
                colorScheme="teal"
                variant="outline"
                size="sm"
                onClick={() => navigateToCourse(course.course_code)}
                mt={2}
              >
                View Reviews
              </Button>
            </Card>
          </GridItem>
        ))
      ) : (
        <Text>No courses available</Text>
      )}
    </Grid>
  );
}
