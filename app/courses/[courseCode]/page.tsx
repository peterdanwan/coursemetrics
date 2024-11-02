// app/courses/[courseCode]/page.tsx

'use client';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
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
  Tag,
  List,
  ListItem,
  Button,
  Stack,
  StackDivider,
  useDisclosure,
} from '@chakra-ui/react';
import CourseReview from '@/components/CourseReview';
import { FaStar, FaRegStar, FaHeart } from 'react-icons/fa';
import { apiFetcher } from '@/utils';
import { useSearchParams } from 'next/navigation';
import SideMenu from '@/components/SideFilterMenuCourse';
import CourseReviewForm from '@/components/CourseReviewForm';
import { useFlexStyle } from '@/styles/styles';

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

function getURL(
  apiRoute: string,
  season: string | null,
  year: string | null,
  courseCode: string | null
) {
  let url: string;
  if (year && season) {
    url = `/api/${apiRoute}/${courseCode}?season=${season}&year=${year}`;
  } else if (year) {
    url = `/api/${apiRoute}/${courseCode}?year=${year}`;
  } else if (season) {
    url = `/api/${apiRoute}/${courseCode}?season=${season}`;
  } else {
    url = `/api/${apiRoute}/${courseCode}`;
    // console.log('here');
  }

  return url;
}

export default function CoursePage({ params }: { params: { courseCode: string } }) {
  const flexStyle = useFlexStyle();
  const courseCode = params.courseCode.toUpperCase();
  const [expandedReviewId, setExpandedReviewId] = useState(-1);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [course, setCourse] = useState<ICourse | null>(null);
  const [terms, setTerms] = useState<ICourseTerm[]>([]);
  const [reviews, setReviews]: any = useState(null);
  const [sections, setSections] = useState<ICourse[]>([]);
  const searchParams = useSearchParams();

  // Get year and season from query params, with fallback to current values
  const year = searchParams.get('year') || null;
  const season = searchParams.get('season') || null;

  const courseURL = getURL('courses', null, null, courseCode);

  const { data: courseResponse, error: courseResponseError } = useSWR(courseURL, apiFetcher);

  // For review form modal
  const {
    isOpen: isCourseReviewFormOpen,
    onOpen: onCourseReviewFormOpen,
    onClose: onCourseReviewFormClose,
  } = useDisclosure();

  useEffect(() => {
    if (courseResponse) {
      console.log(courseResponse);
      const coursesArray = courseResponse.data.courses;
      setCourses(coursesArray);

      // Extract unique terms
      const termMap = new Map<string, ICourseTerm>();
      coursesArray.forEach((courseItem: ICourse) => {
        const termKey = `${courseItem.CourseTerm.season}_${courseItem.CourseTerm.year}`;
        if (!termMap.has(termKey)) {
          termMap.set(termKey, courseItem.CourseTerm);
        }
      });
      const uniqueTerms = Array.from(termMap.values());
      setTerms(uniqueTerms);

      // Find the course that matches the season and year from the URL
      let initialCourse;

      if (year && season) {
        initialCourse = coursesArray.find(
          (courseItem: ICourse) =>
            courseItem.CourseTerm.year.toString() === year &&
            courseItem.CourseTerm.season.toLowerCase() === season.toLowerCase()
        );
      }

      if (!initialCourse) {
        // If no matching course is found, default to the first course
        initialCourse = coursesArray[0];
      }

      setCourse(initialCourse);
      const initialTermKey = `${initialCourse.CourseTerm.season}_${initialCourse.CourseTerm.year}`;
      const initialSections = coursesArray.filter(
        (courseItem: ICourse) =>
          `${courseItem.CourseTerm.season}_${courseItem.CourseTerm.year}` === initialTermKey
      );
      setSections(initialSections);
    }
  }, [courseResponse, year, season]);

  const reviewsURL = course
    ? getURL(
        'reviews/courses',
        course.CourseTerm.season,
        course.CourseTerm.year.toString(),
        courseCode
      )
    : null;

  const { data: reviewResponse, error: reviewResponseError } = useSWR(reviewsURL, apiFetcher);
  // console.log(reviewResponse);

  useEffect(() => {
    if (reviewResponse) {
      if (Array.isArray(reviewResponse.data)) {
        setReviews(reviewResponse.data);
      } else {
        setReviews([]);
      }
    }
  }, [reviewResponse]);

  const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTermKey = e.target.value;
    const [selectedSeason, selectedYear] = selectedTermKey.split('_');

    // Filter courses that match the selected term
    const selectedCourses = courses.filter(
      (course) =>
        course.CourseTerm.season === selectedSeason &&
        course.CourseTerm.year.toString() === selectedYear
    );

    if (selectedCourses.length > 0) {
      setSections(selectedCourses);
      setCourse(selectedCourses[0]); // Set the first course as default
    }
  };

  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCourseId = Number(e.target.value);
    const selectedCourse = sections.find((course) => course.course_id === selectedCourseId);
    if (selectedCourse) {
      setCourse(selectedCourse);
    }
  };

  const toggleExpandedReview = (reviewId: number) => {
    setExpandedReviewId((prevId) => (prevId === reviewId ? -1 : reviewId));
  };

  return (
    <Grid
      gridTemplateColumns="repeat(12, 1fr)"
      gap={{ base: '3', md: '3', lg: '6' }}
      p={{ base: '3', md: '3', lg: '5' }}
      margin="0 auto"
      w={{ base: '100%', '2xl': '80%' }}
      bgColor={flexStyle.bgColor}
    >
      {/* Course Details Section */}
      {reviews ? (
        <>
          <GridItem gridColumn={{ base: 'span 12', md: 'span 8' }}>
            <Card>
              <CardHeader p={{ base: '3', sm: '3', md: '3' }}>
                <Flex align="center" gap={2} wrap="wrap">
                  <Box order={{ base: '1', sm: '1', md: '1', lg: '1' }}>
                    <Heading
                      as="h1"
                      color="teal"
                      fontSize={{ base: '24', sm: '30', md: '30', lg: '36' }}
                      mb={2}
                    >
                      {course?.course_code}
                    </Heading>
                    <Heading as="h2" color="teal" fontSize={{ md: '20' }}>
                      {course?.CourseDetail.course_name}
                    </Heading>
                  </Box>
                  <Spacer order={{ base: '3', sm: '2', md: '2', lg: '2' }} />
                  <Box order={{ base: '2', sm: '3', md: '3', lg: '3' }}>
                    <Flex gap={5} alignItems="center">
                      <Box color="pink.400">
                        <FaHeart size={25} />
                      </Box>
                      <Text>4.5/5</Text>
                    </Flex>
                  </Box>
                </Flex>
              </CardHeader>
              <CardBody p={{ base: '3', sm: '3', md: '3' }}>
                <Text fontSize={{ md: '14' }}>{course?.CourseDetail.course_description}</Text>
                <Text fontSize={{ md: '14' }}>
                  Course Section: <b>{course?.course_section}</b>
                </Text>
                <Text fontSize={{ md: '14' }}>
                  Term: <b>{`${course?.CourseTerm.season} ${course?.CourseTerm.year}`}</b>
                </Text>
                <Text fontSize={{ md: '14' }}>
                  Delivery Format: <b>{course?.course_delivery_format_id}</b>
                </Text>
              </CardBody>
            </Card>
          </GridItem>
          {/* Skills Section */}
          <GridItem gridColumn={{ base: 'span 12', md: 'span 4' }}>
            <Card>
              <CardHeader p={{ base: '3', sm: '3', md: '3' }}>
                <Heading color="teal" fontSize={{ base: '24', sm: '30', md: '30', lg: '36' }}>
                  Skills
                </Heading>
              </CardHeader>
              <CardBody p={{ base: '3', sm: '3', md: '3' }}>
                <List listStyleType="none">
                  <Flex wrap="wrap" gap={5}>
                    <ListItem>
                      <Tag colorScheme="cyan">AWS</Tag>
                    </ListItem>
                    <ListItem>
                      <Tag colorScheme="cyan">Cloud Computing</Tag>
                    </ListItem>
                    <ListItem>
                      <Tag colorScheme="cyan">JavaScript</Tag>
                    </ListItem>
                    <ListItem>
                      <Tag colorScheme="cyan">HTML</Tag>
                    </ListItem>
                  </Flex>
                </List>
              </CardBody>
            </Card>
          </GridItem>
          {/* Course Reviews Section: make it scrollable too see more reviews */}
          <GridItem
            gridColumn={{ base: 'span 12', md: 'span 8' }}
            gridRow={{ base: '2', md: 'span 4' }}
          >
            <Card>
              <CardHeader p={{ base: '3', sm: '3', md: '3' }}>
                <Flex align="center" wrap="wrap" gap={2}>
                  <Heading
                    color="teal"
                    fontSize={{ base: '24', sm: '30', md: '30', lg: '36' }}
                    order={{ base: '1', sm: '1', md: '1', lg: '1' }}
                  >
                    Reviews
                  </Heading>
                  <Spacer order={{ base: '2', sm: '2', md: '2', lg: '2' }} />
                  <Box order={{ base: '3', sm: '3', md: '3', lg: '3' }}>
                    <SideMenu
                      terms={terms}
                      sections={sections}
                      course={course}
                      handleTermChange={handleTermChange}
                      handleSectionChange={handleSectionChange}
                    />
                  </Box>
                </Flex>
              </CardHeader>
              <CardBody p={{ base: '3', sm: '3', md: '3' }}>
                <Flex direction="column" gap={5}>
                  <Stack divider={<StackDivider />} height="700px" overflowY="scroll" spacing="4">
                    {/**** Course Review Component starts here ****/}
                    {/* Check if reviews array exist before calling .map */}
                    {Array.isArray(reviews) ? (
                      reviews.map((review: any, index: number) => (
                        <CourseReview
                          key={index}
                          review={review}
                          expandedReviewId={expandedReviewId}
                          toggleExpandedReview={toggleExpandedReview}
                        />
                      ))
                    ) : (
                      <Text>No reviews available</Text>
                    )}
                    {/**** Course Review Component ends here ****/}
                  </Stack>
                  <Button
                    colorScheme="teal"
                    variant="solid"
                    size="lg"
                    // width="200px"
                    alignSelf="flex-end"
                    mt={5}
                    onClick={onCourseReviewFormOpen}
                  >
                    Add Review
                  </Button>
                  <CourseReviewForm
                    isOpen={isCourseReviewFormOpen}
                    onClose={onCourseReviewFormClose}
                    key={isCourseReviewFormOpen ? 'open' : 'closed'}
                  />
                </Flex>
              </CardBody>
            </Card>
          </GridItem>
          {/* Quick Stats Section */}
          <GridItem gridColumn={{ base: 'span 12', md: 'span 4' }}>
            <Card>
              <CardHeader p={{ base: '3', sm: '3', md: '3' }}>
                <Heading color="teal" fontSize={{ base: '24', sm: '30', md: '30', lg: '36' }}>
                  Quick Stats
                </Heading>
              </CardHeader>
              <CardBody p={{ base: '3', sm: '3', md: '3' }}>
                <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                  <GridItem>
                    <Text as="b">Difficulty:</Text>
                  </GridItem>
                  <GridItem>
                    <Flex color="yellow.300">
                      <Box>
                        <FaStar />
                      </Box>
                      <Box>
                        <FaStar />
                      </Box>
                      <Box>
                        <FaStar />
                      </Box>
                      <Box>
                        <FaRegStar />
                      </Box>
                      <Box>
                        <FaRegStar />
                      </Box>
                    </Flex>
                  </GridItem>

                  <GridItem>
                    <Text as="b">Course Load:</Text>
                  </GridItem>
                  <GridItem>
                    <Flex color="yellow.300">
                      <Box>
                        <FaStar />
                      </Box>
                      <Box>
                        <FaStar />
                      </Box>
                      <Box>
                        <FaRegStar />
                      </Box>
                      <Box>
                        <FaRegStar />
                      </Box>
                      <Box>
                        <FaRegStar />
                      </Box>
                    </Flex>
                  </GridItem>

                  <GridItem>
                    <Text as="b">Average Grade:</Text>
                  </GridItem>
                  <GridItem>
                    <Flex color="yellow.300">
                      <Box>
                        <FaStar />
                      </Box>
                      <Box>
                        <FaStar />
                      </Box>
                      <Box>
                        <FaStar />
                      </Box>
                      <Box>
                        <FaStar />
                      </Box>
                      <Box>
                        <FaRegStar />
                      </Box>
                    </Flex>
                  </GridItem>

                  <GridItem>
                    <Text as="b">Would Take Again:</Text>
                  </GridItem>
                  <GridItem>
                    <Flex color="yellow.300">
                      <Box>
                        <FaStar />
                      </Box>
                      <Box>
                        <FaStar />
                      </Box>
                      <Box>
                        <FaRegStar />
                      </Box>
                      <Box>
                        <FaRegStar />
                      </Box>
                      <Box>
                        <FaRegStar />
                      </Box>
                    </Flex>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>
          </GridItem>
          {/* Prerequisites Section */}
          <GridItem gridColumn={{ base: 'span 12', md: 'span 4' }}>
            <Card>
              <CardHeader p={{ base: '3', sm: '3', md: '3' }}>
                <Heading color="teal" fontSize={{ base: '24', sm: '30', md: '30', lg: '36' }}>
                  Prerequisites
                </Heading>
              </CardHeader>
              <CardBody p={{ base: '3', sm: '3', md: '3' }}>
                <Box>
                  <Text>WEB422 - Web Programming for Apps and Services</Text>
                </Box>
                <Box>
                  <Text>BTI425 - Web Programming for Apps and Services</Text>
                </Box>
              </CardBody>
            </Card>
          </GridItem>
        </>
      ) : (
        <Text>Hello</Text> // Fallback message
      )}
    </Grid>
  );
}
