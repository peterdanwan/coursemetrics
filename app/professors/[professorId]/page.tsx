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
  Select,
  useDisclosure,
} from '@chakra-ui/react';
import CourseReview from '@/components/CourseReview';
import { FaStar, FaRegStar, FaHeart } from 'react-icons/fa';
import { apiFetcher } from '@/utils';
import { useSearchParams } from 'next/navigation';
import ProfReviewForm from '@/components/ProfReviewForm';

import SideMenu from '@/components/SideFilterMenuCourse';

interface IProfessor {
  professor_id: number;
  first_name: string;
  last_name: string;
}

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
  professorId: string | null
) {
  let url: string;
  if (year && season) {
    url = `/api/${apiRoute}/${professorId}?year=${year}&season=${season}`;
  } else if (year) {
    url = `/api/${apiRoute}/${professorId}?year=${year}`;
  } else if (season) {
    url = `/api/${apiRoute}/${professorId}?season=${season}`;
  } else {
    url = `/api/${apiRoute}/${professorId}`;
  }

  return url;
}

function getAllProfessorsURL() {
  return `/api/professors`;
}

export default function ProfessorPage({ params }: { params: { professorId: string } }) {
  const professorId = params.professorId.toUpperCase();
  const [expandedReviewId, setExpandedReviewId] = useState(-1);
  const [profCourses, setProfCourses] = useState<ICourse[]>([]);
  const [professor, setProfessor] = useState<IProfessor | null>(null);
  const [professors, setProfessors] = useState<IProfessor[]>([]);
  const searchParams = useSearchParams();

  // For review form modal
  const {
    isOpen: isCourseReviewFormOpen,
    onOpen: onCourseReviewFormOpen,
    onClose: onCourseReviewFormClose,
  } = useDisclosure();

  // Missing API route for single professor

  // const professorUrl = getURL('professors', null, null, professorId);
  // const { data: professorResponse, error: professorResponseError } = useSWR(
  //   professorUrl,
  //   apiFetcher
  // );
  // useEffect(() => {
  //   if (professorResponse) {
  //     if (Array.isArray(professorResponse.data)) {
  //       setProfessor(professorResponse.data);
  //       console.log(professorResponse.data);
  //     } else {
  //       setProfessor(null);
  //     }
  //   }
  // }, [professorResponse]);

  const professorsURL = getAllProfessorsURL();
  const { data: professorsResponse, error: professorsResponseError } = useSWR(
    professorsURL,
    apiFetcher
  );
  useEffect(() => {
    setProfessors(professorsResponse?.data.professors || []);
  }, [professorsResponse]);

  // find professor by id
  useEffect(() => {
    const professor = professors.find((prof) => prof.professor_id.toString() === professorId);
    if (professor) {
      setProfessor(professor);
    }
  }, [professors, professorId]);

  // const reviewsURL = course
  //   ? getURL('reviews', course.CourseTerm.season, course.CourseTerm.year.toString(), courseCode)
  //   : null;

  // const { data: reviewResponse, error: reviewResponseError } = useSWR(reviewsURL, apiFetcher);

  // useEffect(() => {
  //   if (reviewResponse) {
  //     if (Array.isArray(reviewResponse.data)) {
  //       setReviews(reviewResponse.data);
  //     } else {
  //       setReviews([]);
  //     }
  //   }
  // }, [reviewResponse]);

  // const toggleExpandedReview = (reviewId: number) => {
  //   setExpandedReviewId((prevId) => (prevId === reviewId ? -1 : reviewId));
  // };

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
      {professor ? (
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
                      {professor?.first_name} {professor?.last_name}
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
            </Card>
          </GridItem>
          <GridItem gridColumn={{ base: 'span 12', md: 'span 4' }}>
            <Card>
              <CardHeader p={{ base: '3', sm: '3', md: '3' }}>
                <Heading color="orange.400" fontSize={{ base: '24', sm: '30', md: '30', lg: '36' }}>
                  Courses
                </Heading>
              </CardHeader>
              <CardBody p={{ base: '3', sm: '3', md: '3' }}>
                <List listStyleType="none">
                  <Flex wrap="wrap" gap={5}>
                    {profCourses.map((course, index) => (
                      <ListItem key={index}>
                        <Tag colorScheme="orange">{course.course_code}</Tag>
                      </ListItem>
                    ))}
                  </Flex>
                </List>
              </CardBody>
            </Card>
          </GridItem>
          {/* Professor Reviews Section: make it scrollable too see more reviews */}
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
                    {/* <SideMenu
                      terms={terms}
                      sections={sections}
                      course={course}
                      handleTermChange={handleTermChange}
                      handleSectionChange={handleSectionChange}
                    /> */}
                  </Box>
                </Flex>
              </CardHeader>
              <CardBody p={{ base: '3', sm: '3', md: '3' }}>
                <Flex direction="column" gap={5}>
                  <Stack divider={<StackDivider />} height="700px" overflowY="scroll" spacing="4">
                    {/**** Course Review Component starts here ****/}
                    {/* Check if reviews array exist before calling .map */}
                    {/* {Array.isArray(reviews) ? (
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
                    )} */}
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
                  <ProfReviewForm
                    isOpen={isCourseReviewFormOpen}
                    onClose={onCourseReviewFormClose}
                    key={isCourseReviewFormOpen ? 'open' : 'closed'}
                  />
                </Flex>
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
