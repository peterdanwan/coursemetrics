// app/courses/[courseCode]/page.tsx

'use client';
import { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
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
  Spinner,
  Link,
} from '@chakra-ui/react';
import CourseReview from '@/components/CourseReview';
import { FaStar, FaRegStar, FaHeart } from 'react-icons/fa';
import { apiFetcher } from '@/utils';
import { useSearchParams } from 'next/navigation';
import SideMenu from '@/components/SideFilterMenuCourse';
import CourseReviewForm from '@/components/CourseReviewForm';
import { useFlexStyle } from '@/styles/styles';
import { getFirstFiveComments } from '@/utils/funcs';
import { ReviewEvaluator } from '@/utils/ai';
import RatingIcons from '@/components/RatingIcons';
import useFetchUser from '@/components/useFetchUser';

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
  // For course details
  if (apiRoute === 'courses') {
    if (year && season) {
      return `/api/${apiRoute}/${courseCode}?season=${season}&year=${year}`;
    }
    return `/api/${apiRoute}/${courseCode}`;
  }

  // For reviews - always fetch all approved reviews for the course code
  if (apiRoute === 'reviews/courses') {
    return `/api/${apiRoute}/${courseCode}`;
  }

  return '';
}

export default function CoursePage({ params }: { params: { courseCode: string } }) {
  const flexStyle = useFlexStyle();
  const courseCode = params.courseCode.toUpperCase();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [course, setCourse] = useState<ICourse | null>(null);
  const [terms, setTerms] = useState<ICourseTerm[]>([]);
  const [reviews, setReviews]: any = useState(null);
  const [sections, setSections] = useState<ICourse[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const { user, loading, error } = useFetchUser();

  // Get year and season from query params, with fallback to current values
  const year = searchParams.get('year') || null;
  const season = searchParams.get('season') || null;

  const courseURL = getURL('courses', season, year, courseCode);
  //const reviewsURL = courseCode ? `/api/reviews/courses/${courseCode}` : null;
  const reviewsURL = courseCode
    ? `/api/reviews/courses/${courseCode}${year && season ? `?year=${year}&season=${season}` : ''}`
    : null;
  console.log('courseURL', courseURL);
  console.log('reviewsURL', reviewsURL);

  const { data: courseResponse, error: courseResponseError } = useSWR(courseURL, apiFetcher);
  const { data: reviewResponse, error: reviewResponseError } = useSWR(reviewsURL, apiFetcher);
  console.log('Fetched Course', courseResponse);
  console.log('Fetched Reviews', reviewResponse);

  // For review form modal
  const {
    isOpen: isCourseReviewFormOpen,
    onOpen: onCourseReviewFormOpen,
    onClose: onCourseReviewFormClose,
  } = useDisclosure();

  useEffect(() => {
    if (courseCode) {
      const reviewsURL = `/api/reviews/courses/${courseCode}?year=${year}&season=${season}`;
      mutate(reviewsURL); // Trigger re-fetch based on updated filters
    }
  }, [courseCode, year, season]);

  useEffect(() => {
    if (courseResponse) {
      const coursesArray = courseResponse.data?.courses;
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
        // If no matching course is found or no term selected, use the most recent term
        initialCourse = coursesArray.reduce(
          (latest: any, current: any) => {
            if (!latest) return current;
            const latestDate = new Date(`${latest.CourseTerm.year}-${latest.CourseTerm.season}`);
            const currentDate = new Date(`${current.CourseTerm.year}-${current.CourseTerm.season}`);
            return currentDate > latestDate ? current : latest;
          },
          null as ICourse | null
        );
      }

      setCourse(initialCourse);

      if (initialCourse) {
        const initialTermKey = `${initialCourse.CourseTerm.season}_${initialCourse.CourseTerm.year}`;
        const initialSections = coursesArray.filter(
          (courseItem: ICourse) =>
            `${courseItem.CourseTerm.season}_${courseItem.CourseTerm.year}` === initialTermKey
        );
        setSections(initialSections);
      }
    }
  }, [courseResponse, year, season]);

  useEffect(() => {
    // console.log('course review form is', isCourseReviewFormOpen ? 'open' : 'closed');
    const fetchTags = async () => {
      console.log(reviewResponse);
      if (reviewResponse && reviewResponse.status === 'ok') {
        if (Array.isArray(reviewResponse.data)) {
          const reviewsFromDB = reviewResponse.data;
          const sortedReviews = [...reviewsFromDB].sort(
            (r1: any, r2: any) => parseInt(r2.review_id) - parseInt(r1.review_id)
          );

          setReviews(sortedReviews);

          const reviewEvaluator = new ReviewEvaluator();

          const dynamicTags = await reviewEvaluator.generateTags(
            getFirstFiveComments(reviewResponse.data)
          );

          const uniqueTags = Array.from(new Set(dynamicTags.tags));
          const topUniqueTags = uniqueTags.slice(0, 5);

          setTags(topUniqueTags);
        } else {
          setReviews([]);
        }
      }
    };
    // fetch reviews after submitting new one to update Course Review UI
    if (!isCourseReviewFormOpen) {
      mutate(reviewsURL);
    }
    fetchTags();
  }, [reviewResponse, isCourseReviewFormOpen, reviewsURL]);

  // Hide page's scrollbar when form modal is open:
  useEffect(() => {
    if (isCourseReviewFormOpen) {
      // Hide page scrollbar when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore page scrollbar when modal is closed
      document.body.style.overflow = 'auto';
    }

    // Cleanup to restore scroll behavior when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isCourseReviewFormOpen]);

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

  return (
    <>
      {/* Course Details Section */}
      {reviews ? (
        <Grid
          gridTemplateColumns="repeat(12, 1fr)"
          gap={{ base: '3', md: '3', lg: '6' }}
          p={{ base: '3', md: '3', lg: '5' }}
          margin="0 auto"
          w={{ base: '100%', '2xl': '80%' }}
          bgColor={flexStyle.bgColor}
        >
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
                      {/* Don't need to book mark it */}
                      {/* <Box color="red.500">
                        <FaHeart size={25} />
                      </Box> */}
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
          {/* Tags Section */}
          <GridItem gridColumn={{ base: 'span 12', md: 'span 4' }}>
            <Card>
              <CardHeader p={{ base: '3', sm: '3', md: '3' }}>
                <Heading color="teal" fontSize={{ base: '24', sm: '30', md: '30', lg: '36' }}>
                  Tags
                </Heading>
              </CardHeader>
              <CardBody p={{ base: '3', sm: '3', md: '3' }}>
                <List listStyleType="none">
                  <Flex wrap="wrap" gap={5}>
                    {tags.map((tag: any, index: number) => (
                      <ListItem key={index}>
                        <Tag colorScheme="cyan">{tag}</Tag>
                      </ListItem>
                    ))}
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
                  <Stack
                    divider={<StackDivider />}
                    height="700px"
                    overflowY="scroll"
                    spacing="4"
                    key={isCourseReviewFormOpen ? 'form-open' : 'form-closed-refresh'}
                  >
                    {/**** Course Review Component starts here ****/}
                    {/* Check if reviews array exist before calling .map */}
                    {Array.isArray(reviews) ? (
                      reviews.map((review: any, index: number) => (
                        <CourseReview key={index} review={review} />
                      ))
                    ) : (
                      <Text>No reviews available</Text>
                    )}
                    {/**** Course Review Component ends here ****/}
                  </Stack>
                  {loading ? (
                    <Spinner /> // Or whatever loading indicator you prefer
                  ) : user && user.role_id === 2 ? (
                    <Button
                      colorScheme="teal"
                      variant="solid"
                      size="lg"
                      alignSelf="flex-end"
                      mt={5}
                      onClick={onCourseReviewFormOpen}
                    >
                      Add a Review
                    </Button>
                  ) : (
                    <Text color={flexStyle.color} alignSelf="flex-end" mt={5}>
                      Please{' '}
                      <Link
                        href="/api/auth/login"
                        color={flexStyle.headingColor}
                        _hover={{ color: flexStyle.requiredColor }}
                      >
                        sign in
                      </Link>{' '}
                      as a student to add a review
                    </Text>
                  )}
                  <CourseReviewForm
                    isOpen={isCourseReviewFormOpen}
                    onClose={onCourseReviewFormClose}
                    courseResponse={courseResponse}
                    reviewResponse={reviewResponse}
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
                    <RatingIcons rating="3" iconSize={8} color="teal.200" />
                  </GridItem>

                  <GridItem>
                    <Text as="b">Course Load:</Text>
                  </GridItem>
                  <GridItem>
                    <RatingIcons rating="2" iconSize={8} color="teal.200" />
                  </GridItem>

                  <GridItem>
                    <Text as="b">Average Grade:</Text>
                  </GridItem>
                  <GridItem>
                    <RatingIcons rating="4" iconSize={8} color="teal.200" />
                  </GridItem>

                  <GridItem>
                    <Text as="b">Would Take Again:</Text>
                  </GridItem>
                  <GridItem>
                    <RatingIcons rating="2" iconSize={8} color="teal.200" />
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
        </Grid>
      ) : (
        <Flex justifyContent="center" alignItems="center" h="100vh">
          <Spinner />
        </Flex> // Fallback message
      )}
    </>
  );
}
