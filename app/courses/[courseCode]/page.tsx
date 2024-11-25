// app/courses/[courseCode]/page.tsx

'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
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
  Spinner,
  Link,
} from '@chakra-ui/react';
import CourseReview from '@/components/CourseReview';
import { apiFetcher } from '@/utils';
import { useSearchParams } from 'next/navigation';
import SideMenu from '@/components/SideFilterMenuCourse';
import CourseReviewForm from '@/components/CourseReviewForm';
import { useFlexStyle } from '@/styles/styles';
import RatingIcons from '@/components/RatingIcons';
import useFetchUser from '@/components/useFetchUser';
import NoResults from '@/components/NoResults';

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
  const searchParams = useSearchParams();
  const { user, loading, error } = useFetchUser();

  const year = searchParams.get('year') || null;
  const season = searchParams.get('season') || null;

  const courseURL = getURL('courses', null, null, courseCode);
  const { data: courseResponse, error: courseResponseError } = useSWR(courseURL, apiFetcher);

  const courses: ICourse[] = useMemo(() => {
    if (courseResponse?.data?.courses) {
      return courseResponse.data.courses;
    }
    return [];
  }, [courseResponse]);

  const terms = useMemo(() => {
    if (courses.length === 0) return [];
    const termMap = new Map<string, ICourseTerm>();
    courses.forEach((courseItem) => {
      const termKey = `${courseItem.CourseTerm.season}_${courseItem.CourseTerm.year}`;
      if (!termMap.has(termKey)) {
        termMap.set(termKey, courseItem.CourseTerm);
      }
    });
    return Array.from(termMap.values());
  }, [courses]);

  const [selectedTerm, setSelectedTerm] = useState<string | null>(() => {
    if (year && season) return `${season}_${year}`;
    return null;
  });

  useEffect(() => {
    if (!selectedTerm && terms.length > 0) {
      // Set selectedTerm to the most recent term
      const mostRecentTerm = terms[0];
      setSelectedTerm(`${mostRecentTerm.season}_${mostRecentTerm.year}`);
    }
  }, [terms, selectedTerm]);

  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const reviewsURL = useMemo(() => {
    if (selectedTerm) {
      const [season, year] = selectedTerm.split('_');
      return `/api/reviews/courses/${courseCode}?year=${year}&season=${season}`;
    }
    // If no term is selected, attempt to fetch all reviews
    return `/api/reviews/courses/${courseCode}`;
  }, [courseCode, selectedTerm]);
  const { data: reviewResponse, error: reviewResponseError } = useSWR(reviewsURL, apiFetcher);

  // For review form modal
  const {
    isOpen: isCourseReviewFormOpen,
    onOpen: onCourseReviewFormOpen,
    onClose: onCourseReviewFormClose,
  } = useDisclosure();

  const course = useMemo(() => {
    if (!selectedTerm) {
      if (courses.length > 0) {
        // Assuming courses are sorted by date
        return courses[0];
      }
      return null;
    }
    const [selectedSeason, selectedYear] = selectedTerm.split('_');
    let filteredCourses = courses.filter(
      (course) =>
        course.CourseTerm.season === selectedSeason &&
        course.CourseTerm.year.toString() === selectedYear
    );
    if (selectedSection) {
      filteredCourses = filteredCourses.filter(
        (course) => course.course_section === selectedSection
      );
    }
    return filteredCourses[0] || null;
  }, [courses, selectedTerm, selectedSection]);

  // Extract reviews and related data
  const reviews = useMemo(() => {
    if (reviewResponse?.data?.reviewContent?.reviews) {
      const reviewsFromDB = reviewResponse.data.reviewContent.reviews;
      return [...reviewsFromDB].sort(
        (r1: any, r2: any) => parseInt(r2.review_id) - parseInt(r1.review_id)
      );
    }
    return [];
  }, [reviewResponse]);

  const selectedSectionReviews = useMemo(() => {
    if (selectedSection) {
      return reviews.filter(
        (review) => review.ProfessorCourse.Course.course_section === selectedSection
      );
    }
    return reviews;
  }, [reviews, selectedSection]);

  const quickStats = useMemo(() => {
    if (reviewResponse?.data?.reviewContent?.quickStats) {
      const quickStatsFromDB = reviewResponse.data.reviewContent.quickStats;
      return Object.entries(quickStatsFromDB)
        .filter(([key]) => key !== 'totalReviews')
        .map(([name, value]) => ({ name, value }));
    }
    return [];
  }, [reviewResponse]);

  const totalReviews = useMemo(() => {
    if (reviewResponse?.data?.reviewContent?.quickStats?.totalReviews) {
      return reviewResponse.data.reviewContent.quickStats.totalReviews;
    }
    return 0;
  }, [reviewResponse]);

  const courseAverageRating = useMemo(() => {
    if (quickStats.length > 0) {
      const totalRating = quickStats.reduce(
        (sum, stat) => sum + parseFloat(stat.value as string),
        0
      );
      return Math.round((totalRating / quickStats.length) * 100) / 100;
    }
    return 0;
  }, [quickStats]);

  const tags = useMemo(() => {
    if (reviewResponse?.data?.tags) {
      return reviewResponse.data.tags;
    }
    return [];
  }, [reviewResponse]);

  useEffect(() => {}, [reviewResponse]);

  // Handlers
  const handleTermChange = useCallback((term: string | null) => {
    setSelectedTerm(term);
    setSelectedSection(null);
  }, []);

  const handleSectionChange = useCallback((section: string | null) => {
    setSelectedSection(section);
  }, []);

  // Hide page's scrollbar when form modal is open
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

  function capFirstLetterAndAddSpaces(string: string) {
    if (!(typeof string === 'string' && string.length)) return '';
    const res = string.replace(/([a-z])([A-Z])/g, '$1 $2');
    return res
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  if (courseResponseError || reviewResponseError) return <div>Failed to load data</div>;
  if (!courseResponse || !reviewResponse)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
        &nbsp;&nbsp; Loading ...
      </div>
    );

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
            <Card bgColor={flexStyle.cardBg}>
              <CardHeader p={{ base: '3', sm: '3', md: '3' }}>
                <Flex align="center" gap={2} wrap="wrap">
                  <Box order={{ base: '1', sm: '1', md: '1', lg: '1' }}>
                    <Heading
                      color={flexStyle.headingColor}
                      as="h1"
                      fontSize={{ base: '24', sm: '30', md: '30', lg: '36' }}
                      mb={2}
                    >
                      {course?.course_code}
                    </Heading>
                    <Heading color={flexStyle.headingColor} as="h2" fontSize={{ md: '20' }}>
                      {course?.CourseDetail.course_name}
                    </Heading>
                  </Box>
                  <Spacer order={{ base: '3', sm: '2', md: '2', lg: '2' }} />
                  {Array.isArray(selectedSectionReviews) && selectedSectionReviews.length > 0 && (
                    <Box order={{ base: '2', sm: '3', md: '3', lg: '3' }}>
                      <Flex gap={5} alignItems="center">
                        <Flex gap={2} alignItems="center">
                          <Text fontSize={22}>{courseAverageRating}/5 </Text>
                          <RatingIcons
                            rating={courseAverageRating.toString()}
                            iconSize={5}
                            color="teal.300"
                          />
                          {totalReviews && (
                            <Text as="span">
                              ({totalReviews?.value}
                              {totalReviews?.value > 1 ? ' reviews' : ' review'})
                            </Text>
                          )}
                        </Flex>
                      </Flex>
                    </Box>
                  )}
                </Flex>
              </CardHeader>
              <CardBody p={{ base: '3', sm: '3', md: '3' }}>
                <Text fontSize={{ md: '14' }}>{course?.CourseDetail.course_description}</Text>
              </CardBody>
            </Card>
          </GridItem>
          {/* Tags Section */}
          {Array.isArray(selectedSectionReviews) && selectedSectionReviews.length > 0 && (
            <GridItem gridColumn={{ base: 'span 12', md: 'span 4' }}>
              <Card bgColor={flexStyle.cardBg}>
                <CardHeader p={{ base: '3', sm: '3', md: '3' }}>
                  <Heading
                    color={flexStyle.headingColor}
                    fontSize={{ base: '24', sm: '30', md: '30', lg: '36' }}
                  >
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
          )}
          {/* Course Reviews Section: make it scrollable too see more reviews */}
          <GridItem
            gridColumn={{ base: 'span 12', md: 'span 12', lg: 'span 8' }}
            gridRow={{ base: '2', md: 'span 4' }}
          >
            <Card bgColor={flexStyle.cardBg}>
              <CardHeader p={{ base: '3', sm: '3', md: '3' }}>
                <Flex align="center" wrap="wrap" gap={2}>
                  <Heading
                    color={flexStyle.headingColor}
                    fontSize={{ base: '24', sm: '30', md: '30', lg: '36' }}
                    order={{ base: '1', sm: '1', md: '1', lg: '1' }}
                  >
                    Reviews
                  </Heading>
                  <Spacer order={{ base: '2', sm: '2', md: '2', lg: '2' }} />
                  <Box order={{ base: '3', sm: '3', md: '3', lg: '3' }}>
                    <SideMenu
                      terms={terms}
                      courses={courses}
                      selectedTerm={selectedTerm}
                      selectedSection={selectedSection}
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
                    {Array.isArray(selectedSectionReviews) && selectedSectionReviews.length > 0 ? (
                      selectedSectionReviews.map((review: any, index: number) => (
                        <CourseReview key={index} review={review} />
                      ))
                    ) : (
                      <NoResults
                        statusCode="No reviews found"
                        statusMessage="Try searching for another term or section."
                      />
                    )}
                    {/**** Course Review Component ends here ****/}
                  </Stack>
                  {user && user.role_id === 2 ? (
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
          {/* only render if quickStats is not empty */}
          {Array.isArray(selectedSectionReviews) && selectedSectionReviews.length > 0 && (
            <GridItem gridColumn={{ base: 'span 12', md: 'span 8', lg: 'span 4' }}>
              <Card bgColor={flexStyle.cardBg}>
                <CardHeader p={{ base: '3', sm: '3', md: '3' }}>
                  <Heading
                    color={flexStyle.headingColor}
                    fontSize={{ base: '24', sm: '30', md: '30', lg: '36' }}
                  >
                    Quick Stats
                  </Heading>
                </CardHeader>
                <CardBody p={{ base: '3', sm: '3', md: '3' }}>
                  {quickStats && quickStats.length ? (
                    quickStats.map((stat: any, index: number) => (
                      <Flex key={index} gap={2} alignItems="center">
                        <Box w="150px">
                          <Text as="b" whiteSpace="nowrap">
                            {capFirstLetterAndAddSpaces(stat.name)}:{' '}
                          </Text>
                        </Box>
                        <Box ml={2}>
                          <RatingIcons
                            rating={stat.value}
                            iconSize={{ base: '5', sm: '8', lg: '8' }}
                            color="teal.200"
                          />
                        </Box>
                      </Flex>
                    ))
                  ) : (
                    <Box>No stats available</Box>
                  )}
                </CardBody>
              </Card>
            </GridItem>
          )}
        </Grid>
      ) : (
        <Flex justifyContent="center" alignItems="center" h="100vh">
          <Spinner />
        </Flex> // Fallback message
      )}
    </>
  );
}
