// app/professors/[professorId]/page.tsx

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
  Select,
  Spinner,
  useDisclosure,
  Divider,
} from '@chakra-ui/react';
import { FaHeart } from 'react-icons/fa';
import { apiFetcher } from '@/utils';
import { useSearchParams } from 'next/navigation';
import ProfReviewForm from '@/components/ProfReviewForm';
import ProfessorReview from '@/components/ProfessorReview';

import { useFlexStyle } from '@/styles/styles';
import RatingIcons from '@/components/RatingIcons';

const calculateAverageRating = (quickStats: any) => {
  let totalRating = 0;
  let ratingCount = 0;

  // Loop through each rating field and sum the values
  quickStats.forEach((stat: any) => {
    totalRating += parseInt(stat.value);
    ratingCount++;
  });

  // Calculate the average rating
  const averageRating = totalRating / ratingCount;

  // Return the average rating
  return Math.round(averageRating * 100) / 100;
};

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

export default function ProfessorPage({ params }: { params: { professorId: string } }) {
  const flexStyle = useFlexStyle();
  const professorId = params.professorId.toUpperCase();
  const [profCourses, setProfCourses] = useState<any>(null);
  const [professor, setProfessor] = useState<any>(null);
  const [reviews, setReviews] = useState<any>(null);
  const [uniqueCourseCodes, setUniqueCourseCodes] = useState<any>(null);
  const [quickStats, setQuickStats] = useState<any>(null);
  const [totalReviews, setTotalReviews] = useState<any>(null);
  const [profAvgRating, setProfAvgRating] = useState<number>(0);

  // For review form modal
  const {
    isOpen: isProfReviewFormOpen,
    onOpen: onProfReviewFormOpen,
    onClose: onProfReviewFormClose,
  } = useDisclosure();

  const professorURL = `/api/professors/${professorId}`;

  const profReviewsByProfIdURL = `/api/reviews/professors/${professorId}`; //

  const { data: professorResponse, error: professorResponseError } = useSWR(
    professorURL,
    apiFetcher
  );

  const { data: professorReviewsResponse, error: professorReviewsResponseError } = useSWR(
    profReviewsByProfIdURL,
    apiFetcher
  );

  useEffect(() => {
    if (professorResponse && professorResponse.status === 'ok') {
      const { professor: profFromDB, professorCourses: profCoursesFromDB } = professorResponse.data;
      setProfessor(profFromDB);
      setProfCourses(profCoursesFromDB);

      // console.log(professorResponse);

      // console.log(profFromDB);
      // console.log(profCoursesFromDB);

      const uniqueCourseCodes = Array.from(
        new Set(profCoursesFromDB?.map((course: any) => course.Course.course_code))
      );
      setUniqueCourseCodes(uniqueCourseCodes);
    }
  }, [professorResponse]);

  useEffect(() => {
    if (!isProfReviewFormOpen) mutate(profReviewsByProfIdURL);

    if (professorReviewsResponse && professorReviewsResponse.status === 'ok') {
      const { quickStats: quickStatsFromDB, reviews: profReviewsFromDB } =
        professorReviewsResponse.data;

      const sortedReviews = [...profReviewsFromDB].sort(
        (r1: any, r2: any) => parseInt(r2.review_id) - parseInt(r1.review_id)
      );

      let quickStatsArr = [];
      let totalReviewsData = {};
      for (const statName in quickStatsFromDB) {
        const stat = { name: statName, value: quickStatsFromDB[statName] };
        if (statName === 'totalReviews') {
          totalReviewsData = stat;
        } else {
          quickStatsArr.push(stat);
        }
      }

      const avgRating = calculateAverageRating(quickStatsArr);
      setProfAvgRating(avgRating);
      setReviews(sortedReviews);
      setTotalReviews(totalReviewsData);
      setQuickStats(quickStatsArr);
      // console.log(professorReviewsResponse.data);
    }
  }, [professorReviewsResponse, isProfReviewFormOpen, profReviewsByProfIdURL]);

  // Hide page's scrollbar when form modal is open:
  useEffect(() => {
    if (isProfReviewFormOpen) {
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
  }, [isProfReviewFormOpen]);

  function capFirstLetterAndAddSpaces(string: string) {
    if (!(typeof string === 'string' && string.length)) return false;
    const res = string.replace(/([a-z])([A-Z])/g, '$1 $2');
    return res
      .split(' ') // Split the string into an array of words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
      .join(' '); // Join the words back into a single string
  }

  return (
    <>
      {professor ? (
        <Grid
          gridTemplateColumns="repeat(12, 1fr)"
          gap={{ base: '3', md: '3', lg: '6' }}
          p={{ base: '3', md: '3', lg: '5' }}
          margin="0 auto"
          w={{ base: '100%', '2xl': '80%' }}
          bgColor={flexStyle.bgColor}
        >
          {/* Prof Details Section */}
          <GridItem gridColumn={{ base: 'span 12', md: 'span 8' }}>
            <Card bgColor="gray.50">
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
                      <Box color="red.500">
                        <FaHeart size={25} />
                      </Box>
                      <Flex gap={2} alignItems="center">
                        <Text fontSize={22}>{profAvgRating}/5 </Text>
                        <RatingIcons
                          rating={profAvgRating.toString()}
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
                </Flex>
              </CardHeader>
            </Card>
          </GridItem>
          {uniqueCourseCodes && uniqueCourseCodes.length && (
            <GridItem gridColumn={{ base: 'span 12', md: 'span 4' }}>
              <Card bgColor="gray.50">
                <CardHeader p={{ base: '3', sm: '3', md: '3' }}>
                  <Heading color="teal" fontSize={{ base: '24', sm: '30', md: '30', lg: '36' }}>
                    Courses
                  </Heading>
                </CardHeader>
                <CardBody p={{ base: '3', sm: '3', md: '3' }}>
                  <List listStyleType="none">
                    <Flex wrap="wrap" gap={5}>
                      {uniqueCourseCodes.map((courseTag: any, index: number) => (
                        <ListItem key={index}>
                          <Tag colorScheme="orange">{courseTag}</Tag>
                        </ListItem>
                      ))}
                    </Flex>
                  </List>
                </CardBody>
              </Card>
            </GridItem>
          )}

          {/* Professor Reviews Section: make it scrollable too see more reviews */}
          <GridItem
            gridColumn={{ base: 'span 12', md: 'span 8' }}
            gridRow={{ base: '2', md: 'span 4' }}
          >
            <Card bgColor="gray.50">
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
                  <Box order={{ base: '3', sm: '3', md: '3', lg: '3' }}></Box>
                </Flex>
              </CardHeader>
              <CardBody p={{ base: '3', sm: '3', md: '3' }}>
                <Flex direction="column" gap={5}>
                  <Stack
                    divider={<StackDivider />}
                    height="700px"
                    overflowY="scroll"
                    spacing="4"
                    key={isProfReviewFormOpen ? 'form-open' : 'form-closed-refresh'}
                  >
                    {/**** Prof Review Component starts here ****/}
                    {/* Check if reviews array exist before calling .map */}
                    {Array.isArray(reviews) ? (
                      reviews.map((review: any, index: number) => (
                        <ProfessorReview key={index} review={review} />
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
                    onClick={onProfReviewFormOpen}
                  >
                    Add Review
                  </Button>
                  <ProfReviewForm
                    isOpen={isProfReviewFormOpen}
                    onClose={onProfReviewFormClose}
                    key={isProfReviewFormOpen ? 'open' : 'closed'}
                    professor={professor}
                    profReviews={reviews}
                    professorCourses={profCourses}
                    uniqueCourseCodes={uniqueCourseCodes}
                  />
                </Flex>
              </CardBody>
            </Card>
          </GridItem>
          {/* Skills Section */}
          <GridItem gridColumn={{ base: 'span 12', md: 'span 4' }}>
            <Card bgColor="gray.50">
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
          <GridItem gridColumn={{ base: 'span 12', md: 'span 8', lg: 'span 4' }}>
            <Card bgColor="gray.50">
              <CardHeader p={{ base: '3', sm: '3', md: '3' }}>
                <Heading color="teal" fontSize={{ base: '24', sm: '30', md: '30', lg: '36' }}>
                  Quick Stats
                </Heading>
              </CardHeader>
              <CardBody p={{ base: '3', sm: '3', md: '3' }}>
                {/* <Grid templateColumns="repeat(1, 1fr)" gap={2}> */}
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
          {/* Prerequisites Section */}
          {/* <GridItem gridColumn={{ base: 'span 12', md: 'span 4' }}>
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
          </GridItem> */}
        </Grid>
      ) : (
        <Flex justifyContent="center" alignItems="center" h="100vh">
          <Spinner />
        </Flex> // Fallback message
      )}
    </>
  );
}
