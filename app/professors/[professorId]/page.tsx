// app/professors/[professorId]/page.tsx

'use client';
import { useState } from 'react';
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
import { FaStar, FaRegStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import ProfessorReview from '@/components/ProfessorReview';

// Dummy data for testing
const res = {
  reviews: [
    {
      id: 1,
      title: 'Insightful and Engaging Lecturer',
      content: [
        'Professor James is one of the most insightful and engaging lecturers I’ve had throughout my academic journey. His deep knowledge of the subject matter is evident in every lecture, and he has a remarkable ability to explain complex topics in a way that’s easy to understand. His lectures are always well-structured, and he uses real-world examples that make the content more relatable and interesting. I always looked forward to his classes because of the dynamic way he presents material.',
        "That being said, the coursework is demanding. He assigns a lot of readings, and his exams are quite difficult, requiring both a solid understanding of the theory and the ability to apply it in practical scenarios. The workload can be overwhelming at times, but if you're committed to the subject, you'll learn a great deal. ",
        'In terms of support, Professor Adams is always available for questions during office hours and responds promptly to emails. He genuinely cares about his students’ success and is willing to help if you reach out. The feedback he provides on assignments is incredibly detailed, which helps you understand where you went wrong and how to improve.',
        'Overall, Professor Adams is an excellent professor for those who are willing to put in the effort. He challenges you to think critically, and by the end of the course, I felt more confident in my knowledge of the subject. I would definitely recommend taking his class if you’re ready for an intellectually stimulating experience.',
      ],
      bookmark: true,
    },
    {
      id: 2,
      title: 'Difficult but Worth It',
      content: [
        "One of the best experiences I've had with a professor.",
        'Would definitely take their class again.',
      ],
      bookmark: true,
    },
    {
      id: 3,
      title: 'Amazing Experience',
      content: [
        'Knows the subject very well.',
        "Learned a lot but the professor's pace was too fast for me.",
      ],
      bookmark: true,
    },
    {
      id: 4,
      title: 'Difficult but Worth It',
      content: [
        'Knows the subject very well.',
        "Learned a lot but the professor's pace was too fast for me.",
      ],
      bookmark: true,
    },
    {
      id: 5,
      title: 'Great Professor',
      content: [
        "One of the best experiences I've had with a professor.",
        'Would definitely take their class again.',
      ],
      bookmark: false,
    },
    {
      id: 6,
      title: 'Difficult but Worth It',
      content: [
        'This professor is fantastic!',
        'Great teaching style and makes the subject easy to understand.',
      ],
      bookmark: false,
    },
    {
      id: 7,
      title: 'Engaging and Fun',
      content: [
        'A bit strict with deadlines, but overall a great professor.',
        'Class was tough but very rewarding.',
      ],
      bookmark: false,
    },
    {
      id: 8,
      title: 'Difficult but Worth It',
      content: [
        'Very approachable and always ready to help.',
        'Highly recommend for anyone looking for a good challenge.',
      ],
      bookmark: false,
    },
    {
      id: 9,
      title: 'Engaging and Fun',
      content: [
        'The professor explained everything clearly.',
        'Assignments were tough but manageable.',
        'I learned a lot.',
      ],
      bookmark: false,
    },
    {
      id: 10,
      title: 'Engaging and Fun',
      content: [
        'I found the course difficult and the professor was not helpful.',
        'Would not take again.',
      ],
      bookmark: false,
    },
  ],
};

const coursesRes = {
  courses: [
    {
      course_id: 1,
      course_code: 'WEB222',
      course_detail_id: 101,
      course_detail: {
        course_name: 'Introduction to Web Programming',
        description:
          'Learn the basics of HTML, JavaScript, and CSS, and how to create interactive web pages.',
      },
      course_term_id: 20241,
      course_term: {
        season: 'Fall',
        year: 2024,
      },
      course_section: 'NAA',
      course_delivery_format_id: 1,
      course_delivery_format: {
        name: 'Online Async',
      },
    },
    {
      course_id: 2,
      course_code: 'DBS301',
      course_detail_id: 102,
      course_detail: {
        course_name: 'Database Systems',
        description: 'Explore relational database management systems and SQL fundamentals.',
      },
      course_term_id: 20241,
      course_term: {
        season: 'Fall',
        year: 2024,
      },
      course_section: 'NAB',
      course_delivery_format_id: 2,
      course_delivery_format: {
        name: 'Online Sync',
      },
    },
    {
      course_id: 3,
      course_code: 'OOP344',
      course_detail_id: 103,
      course_detail: {
        course_name: 'Object-Oriented Programming',
        description:
          'An in-depth course on OOP principles, covering topics such as classes, inheritance, and polymorphism.',
      },
      course_term_id: 20241,
      course_term: {
        season: 'Fall',
        year: 2024,
      },
      course_section: 'NAC',
      course_delivery_format_id: 3,
      course_delivery_format: {
        name: 'In-person',
      },
    },
    {
      course_id: 4,
      course_code: 'INT422',
      course_detail_id: 104,
      course_detail: {
        course_name: 'Internet of Things',
        description: 'Learn about IoT devices, architectures, and the future of connected systems.',
      },
      course_term_id: 20241,
      course_term: {
        season: 'Fall',
        year: 2024,
      },
      course_section: 'NAD',
      course_delivery_format_id: 4,
      course_delivery_format: {
        name: 'Hybrid',
      },
    },
    {
      course_id: 5,
      course_code: 'CPS707',
      course_detail_id: 105,
      course_detail: {
        course_name: 'Artificial Intelligence',
        description: 'Introduction to AI concepts, machine learning, and neural networks.',
      },
      course_term_id: 20242,
      course_term: {
        season: 'Winter',
        year: 2025,
      },
      course_section: 'NBA',
      course_delivery_format_id: 5,
      course_delivery_format: {
        name: 'Flexible',
      },
    },
  ],
};

export default function ProfessorPage({ params }: { params: { courseCode: string } }) {
  const courseCode = params.courseCode;
  const [expandedReviewId, setExpandedReviewId] = useState(-1);

  // Toggle expanded review
  const toggleExpandedReview = (reviewId: number) => {
    setExpandedReviewId((prevId) => (prevId === reviewId ? -1 : reviewId));
  };

  // Fetching data from the API
  const professorReviews = res.reviews;
  const courses = coursesRes.courses;

  return (
    <Grid
      gridTemplateColumns="repeat(12, 1fr)"
      gap={{ base: '3', md: '3', lg: '6' }}
      p={{ base: '3', md: '3', lg: '5' }}
      margin="0 auto"
      w={{ base: '100%', '2xl': '80%' }}
      bgColor={'gray.100'}
    >
      {/* Course Details Section*/}
      <GridItem alignSelf="stretch" gridColumn={{ base: 'span 12', md: 'span 8' }}>
        <Card>
          <CardHeader p={{ base: '3', sm: '3', md: '3' }}>
            <Flex align="center" gap={2} wrap="wrap">
              <Box order={{ base: '1', sm: '1', md: '1', lg: '1' }}>
                <Heading
                  as="h1"
                  color="orange.400"
                  fontSize={{ base: '24', sm: '30', md: '30', lg: '36' }}
                  mb={2}
                >
                  James Miller
                </Heading>
                <Heading as="h2" color="orange.400" fontSize={{ md: '20' }}>
                  PRJ666 - Project Implementation
                </Heading>
              </Box>
              <Spacer order={{ base: '3', sm: '2', md: '2', lg: '2' }} />
              <Box order={{ base: '2', sm: '3', md: '3', lg: '3' }}>
                <Flex gap={5} alignItems="center">
                  <Box color="pink.400">
                    <FaRegHeart size={25} />
                  </Box>
                  <Text>4.5/5</Text>
                </Flex>
              </Box>
            </Flex>
          </CardHeader>
        </Card>
      </GridItem>
      {/* Courses Section */}
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
                {courses.map((course, index) => (
                  <ListItem key={index}>
                    <Tag colorScheme="orange">{course.course_code}</Tag>
                  </ListItem>
                ))}
              </Flex>
            </List>
          </CardBody>
        </Card>
      </GridItem>
      {/* Reviews Section */}
      <GridItem
        gridColumn={{ base: 'span 12', md: 'span 8' }}
        gridRow={{ base: '2', md: 'span 4' }}
      >
        <Card>
          <CardHeader p={{ base: '3', sm: '3', md: '3' }}>
            <Flex align="center" wrap="wrap" gap={2}>
              <Heading
                color="orange.400"
                fontSize={{ base: '24', sm: '30', md: '30', lg: '36' }}
                order={{ base: '1', sm: '1', md: '1', lg: '1' }}
              >
                Reviews
              </Heading>
              {/* <Spacer order={{ base: '2', sm: '2', md: '2', lg: '2' }} />
              <Box order={{ base: '3', sm: '3', md: '3', lg: '3' }}>
                <Text>
                  Filter by: <span>[Professor]</span>
                </Text>
              </Box> */}
            </Flex>
          </CardHeader>
          <CardBody p={{ base: '3', sm: '3', md: '3' }}>
            <Flex direction="column" gap={5}>
              <Stack divider={<StackDivider />} height="700px" overflowY="scroll" spacing="4">
                {/**** Review Component starts here ****/}
                {professorReviews.map((review, index) => (
                  <ProfessorReview
                    key={index}
                    review={review}
                    expandedReviewId={expandedReviewId}
                    toggleExpandedReview={toggleExpandedReview}
                  />
                ))}
                {/**** Review Component ends here ****/}
              </Stack>
              <Button
                bg="orange.400"
                colorScheme="orange.400"
                variant="solid"
                size="lg"
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
      <GridItem gridColumn={{ base: 'span 12', md: 'span 4' }}>
        <Card>
          <CardHeader p={{ base: '3', sm: '3', md: '3' }}>
            <Heading color="orange.400" fontSize={{ base: '24', sm: '30', md: '30', lg: '36' }}>
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
    </Grid>
  );
}
