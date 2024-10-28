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
} from '@chakra-ui/react';
import CourseReview from '@/components/CourseReview';
import { FaStar, FaRegStar, FaHeart } from 'react-icons/fa';
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

function getURL(
  apiRoute: string,
  season: string | null,
  year: string | null,
  courseCode: string | null
) {
  let url: string;
  if (year && season) {
    url = `/api/${apiRoute}/${courseCode}?year=${year}&season=${season}`;
  } else if (year) {
    url = `/api/${apiRoute}/${courseCode}?year=${year}`;
  } else if (season) {
    url = `/api/${apiRoute}/${courseCode}?season=${season}`;
  } else {
    url = `/api/${apiRoute}/${courseCode}`;
    console.log('here');
  }

  return url;
}

export default function CoursePage({ params }: { params: { courseCode: string } }) {
  const courseCode = params.courseCode.toUpperCase();
  const [expandedReviewId, setExpandedReviewId] = useState(-1);
  const [course, setCourse] = useState<ICourse | null>(null);
  const [reviews, setReviews]: any = useState(null);
  const searchParams = useSearchParams();

  // Get year and season from query params, with fallback to current values
  const year = searchParams.get('year') || null;
  const season = searchParams.get('season') || null;

  const courseURL = getURL('courses', season, year, courseCode);
  const reviewsURL = getURL('reviews', season, year, courseCode);

  const { data: courseResponse, error: courseResponseError } = useSWR(courseURL, apiFetcher);

  const { data: reviewResponse, error: reviewResponseError } = useSWR(
    courseResponse ? reviewsURL : null,
    apiFetcher
  );

  useEffect(() => {
    if (courseResponse) {
      setCourse(courseResponse.data.courses[0]);
    }
    if (reviewResponse) {
      setReviews(reviewResponse.data);
    }
  }, [courseResponse, reviewResponse]);

  // Define the gridColumn property dynamically based on screen size
  // const gridColumnValue = useBreakpointValue({ base: 'span 8', md: 'span 8' });

  // Toggle expanded review
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
      bgColor={'gray.100'}
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
                    <Text>
                      Filter by: <span>[Professor]</span>
                    </Text>
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
                  >
                    Add Review
                  </Button>
                </Flex>
              </CardBody>
            </Card>
          </GridItem>
          {/* Quick Stats Section */}
          {/* TODO: Componentize QuickStats */}
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
          {/* TODO: Componentize Prerequisite */}
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
