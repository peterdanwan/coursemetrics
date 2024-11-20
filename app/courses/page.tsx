// app/courses/page.tsx

'use client';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { useSearchParams } from 'next/navigation';
import {
  Grid,
  GridItem,
  Box,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  Spinner,
} from '@chakra-ui/react';
import CourseCard from '@/components/CourseCard'; // Ensure the path is correct
import { apiFetcher } from '@/utils';
import { useFlexStyle } from '@/styles/styles';
import NotFound from '@/components/NotFound';

interface ICourseTerm {
  course_term_id: number;
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
  CourseDetail: ICourseDetail;
  course_term_id: number;
  course_section: string;
  course_delivery_format_id: number;
  createdAt: string;
  updatedAt: string;
  CourseTerm: ICourseTerm;
}

function getURL(page: string | null, limit: string) {
  let url: string;
  url = `/api/courses`;
  return url;
}

export default function CoursesPage() {
  const flexStyle = useFlexStyle();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [groupedCourses, setGroupedCourses] = useState<Record<string, ICourse[]>>({});
  const [limit, setLimit] = useState<string>('2');

  const page = searchParams.get('page') || null;
  const coursesURL = getURL(page, limit);

  const { data: coursesResponse, error } = useSWR(coursesURL, apiFetcher);
  console.log('Course Resoonse in Courses page', coursesResponse);

  useEffect(() => {
    if (coursesResponse) {
      const coursesArray = coursesResponse?.data.courses || [];
      // Filter courses based on search query
      const filteredCourses = searchQuery
        ? coursesArray.filter(
            (course: ICourse) =>
              course.course_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
              course.CourseDetail.course_name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : coursesArray;

      // Group filtered courses by course_code
      const groupedCourses = filteredCourses.reduce(
        (acc: Record<string, ICourse[]>, course: ICourse) => {
          const { course_code } = course;
          if (!acc[course_code]) {
            acc[course_code] = [];
          }
          acc[course_code].push(course);
          return acc;
        },
        {}
      );
      setGroupedCourses(groupedCourses);
    }
  }, [coursesResponse, searchQuery]);

  if (error) return <Text>Error loading courses</Text>;
  if (!coursesResponse)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
        &nbsp;&nbsp; Loading courses...
      </div>
    );
  const uniqueCourseCodes = Object.keys(groupedCourses);
  const displayedCourseCodes = uniqueCourseCodes;

  return (
    <>
      <Grid
        gridTemplateColumns="repeat(12, 1fr)"
        gap={{ base: '3', md: '3', lg: '6' }}
        p={{ base: '3', md: '3', lg: '5' }}
        margin="0 auto"
        w={{ base: '100%', xl: '95%' }}
      >
        {uniqueCourseCodes.length > 0 && (
          <GridItem
            gridColumn={{ base: 'span 12' }}
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
          ></GridItem>
        )}
        {uniqueCourseCodes.length > 0 ? (
          displayedCourseCodes.map((courseCode) => (
            <GridItem key={courseCode} gridColumn={{ base: 'span 12', md: 'span 6', lg: 'span 4' }}>
              <CourseCard courses={groupedCourses[courseCode]} />
            </GridItem>
          ))
        ) : (
          <GridItem gridColumn={{ base: 'span 12' }}>
            <NotFound statusCode="No Courses Found" />
          </GridItem>
        )}
      </Grid>
    </>
  );
}
