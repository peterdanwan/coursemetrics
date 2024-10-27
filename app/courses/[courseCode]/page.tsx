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
import { StarIcon } from '@chakra-ui/icons';
import CourseReview from '@/components/CourseReview';
import { FaStar, FaRegStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import { apiFetcher } from '@/utils';

// Dummy data for testing
const res = {
  reviews: [
    {
      id: 1,
      title: 'Great Course',
      content: [
        'CCP555 offers a comprehensive introduction to cloud computing for programmers. The course dives deep into popular cloud platforms like AWS and Microsoft Azure, providing hands-on labs that help reinforce key concepts like virtual machines, containers, and cloud storage. I appreciated the real-world examples, as they gave context to abstract topics like Infrastructure as a Service (IaaS) and Platform as a Service (PaaS).',
        'The assignments were challenging but rewarding, especially those that involved setting up scalable cloud solutions. By the end of the course, I felt comfortable deploying web applications and databases in a cloud environment. However, some modules felt rushed, and I think the course could benefit from a bit more time spent on Kubernetes. Overall, CCP555 is a solid course that equips you with the skills necessary to work with cloud technologies.',
      ],
      wouldTakeAgain: 'Yes',
      difficulty: 3,
      courseLoad: 4,
      grade: 'A+',
      professor: 'David Humphrey',
      bookmark: false,
    },
    {
      id: 2,
      title: 'Too much course load',
      content: [
        'CCP555 is a well-rounded course for programmers interested in cloud computing. The curriculum is well-structured, beginning with cloud fundamentals and gradually moving towards more complex topics like microservices and DevOps practices. The hands-on labs were a highlight, allowing us to work directly with AWS and Docker, making the learning experience very practical. One of the strengths of the course is its focus on scalability and security in cloud environments, which are critical in real-world applications.',
        'The instructor’s explanations were clear, although the pacing was sometimes too fast, particularly in the sections on serverless computing. Despite that, the course provided ample resources to catch up. I highly recommend CCP555 to anyone looking to expand their skill set in cloud technologies.',
      ],
      wouldTakeAgain: 'No',
      difficulty: 5,
      courseLoad: 5,
      grade: 'C+',
      professor: 'Harvey Dumfred',
      bookmark: true,
    },
    {
      id: 3,
      title: 'Challenging but worth it',
      content: [
        'The CCP555 course was tough but incredibly valuable. The instructor emphasized practical skills like cloud deployment and security, and the hands-on labs made everything stick. AWS and Azure were challenging at first, but with the course’s resources and assignments, I managed to get a good grasp by the end. The topics on scaling and security were especially helpful.',
        'The workload was a bit intense, and balancing the projects with other courses was difficult. That said, I’m much more comfortable with cloud technologies now and would recommend this course to others.',
      ],
      wouldTakeAgain: 'Yes',
      difficulty: 4,
      courseLoad: 5,
      grade: 'B+',
      professor: 'Sara Lee',
      bookmark: false,
    },
    {
      id: 4,
      title: 'Too fast-paced',
      content: [
        'I found CCP555 to be an interesting course but extremely fast-paced. We covered AWS, Azure, and Kubernetes all within a few weeks, and the labs sometimes felt rushed. Although the course content was solid, I often struggled to keep up with the pace of the lectures. However, the professor was very knowledgeable and tried to accommodate students.',
        'If you’re willing to put in extra time to review and study, this course can be very rewarding. The projects were well-designed, but the workload was overwhelming at times.',
      ],
      wouldTakeAgain: 'No',
      difficulty: 4,
      courseLoad: 5,
      grade: 'B-',
      professor: 'David Humphrey',
      bookmark: true,
    },
    {
      id: 5,
      title: 'Very practical and insightful',
      content: [
        'CCP555 was a great course, offering deep dives into cloud computing with a focus on real-world applications. The labs were practical and engaging, particularly those covering Docker and Kubernetes. I appreciated the emphasis on cloud security and scaling strategies, which are highly relevant in today’s job market.',
        'The lectures were clear, and the professor’s examples from industry experience were insightful. The only downside was the occasional overload of information. I would have liked more time on Kubernetes. Overall, a great course!',
      ],
      wouldTakeAgain: 'Yes',
      difficulty: 3,
      courseLoad: 4,
      grade: 'A',
      professor: 'Sarah Williams',
      bookmark: false,
    },
    {
      id: 6,
      title: 'Overwhelming workload',
      content: [
        'While the content in CCP555 is important for cloud computing, the workload is incredibly high. Each week felt like a marathon with tons of labs, reading, and projects. Even though the labs were helpful, the pace made it hard to absorb everything. I feel like I need to review the material again after the course is over to fully grasp it.',
        'The professor was helpful, but there wasn’t enough time to really dive deep into the cloud platforms. Overall, I wouldn’t take it again unless the workload was reduced.',
      ],
      wouldTakeAgain: 'No',
      difficulty: 5,
      courseLoad: 5,
      grade: 'C',
      professor: 'Harvey Dumfred',
      bookmark: false,
    },
    {
      id: 7,
      title: 'Insightful and engaging',
      content: [
        'I thoroughly enjoyed CCP555. The content was engaging, and the hands-on labs provided a real sense of working in a cloud environment. Learning about Infrastructure as a Service and Platform as a Service was very useful, and the AWS labs helped solidify the concepts. I now feel much more prepared for working with cloud infrastructure.',
        'I would recommend this course to anyone interested in cloud computing. It was well-balanced between theory and practice, though more time on certain complex topics would have been helpful.',
      ],
      wouldTakeAgain: 'Yes',
      difficulty: 3,
      courseLoad: 3,
      grade: 'A-',
      professor: 'David Humphrey',
      bookmark: true,
    },
    {
      id: 8,
      title: 'Too much content crammed into one course',
      content: [
        'CCP555 covers a lot of ground, and it’s easy to feel overwhelmed by the amount of material. AWS, Docker, Kubernetes—it’s all there, but we moved so quickly that it was hard to keep up. The labs were useful but sometimes didn’t give enough time to really experiment with the cloud environments.',
        'I wish we had focused more deeply on fewer topics instead of rushing through so many. Despite this, the course gave me a broad understanding of cloud computing, though I’ll need to review the material after the course ends.',
      ],
      wouldTakeAgain: 'No',
      difficulty: 5,
      courseLoad: 5,
      grade: 'B',
      professor: 'Harvey Dumfred',
      bookmark: false,
    },
    {
      id: 9,
      title: 'Well-structured and informative',
      content: [
        'CCP555 was a fantastic course. The content was well-structured, and the focus on both AWS and Azure provided a comprehensive view of cloud technologies. I really enjoyed the practical aspects, especially the labs where we deployed applications and worked with databases in the cloud.',
        'The course load was manageable, but some of the lectures felt rushed, particularly towards the end when we covered Kubernetes. Overall, a solid course that I would recommend to anyone looking to enhance their cloud computing skills.',
      ],
      wouldTakeAgain: 'Yes',
      difficulty: 4,
      courseLoad: 4,
      grade: 'A',
      professor: 'Sarah Lee',
      bookmark: true,
    },
    {
      id: 10,
      title: 'Great hands-on experience',
      content: [
        'CCP555 provided a great balance of theory and hands-on experience. I really enjoyed the labs, especially those focused on Docker and cloud deployment. The assignments were challenging but definitely worth it, as I now feel much more comfortable working with cloud infrastructure.',
        'My only complaint is that the course could have spent more time on security in cloud environments. Other than that, it was a fantastic learning experience.',
      ],
      wouldTakeAgain: 'Yes',
      difficulty: 3,
      courseLoad: 4,
      grade: 'A-',
      professor: 'David Humphrey',
      bookmark: true,
    },
  ],
};

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

export default function CoursePage({ params }: { params: { courseCode: string } }) {
  const courseCode = params.courseCode;
  const [expandedReviewId, setExpandedReviewId] = useState(-1);
  const [course, setCourse] = useState<ICourse | null>(null);

  const year = 2024;
  const season = 'Winter';

  const { data: response, error } = useSWR(
    `/api/courses/${courseCode}?year=${year}&season=${season}`,
    apiFetcher
  );

  // Use useEffect to update courseDetail only when data changes
  useEffect(() => {
    if (response) {
      setCourse(response.data.courses[0]);
    }
  }, [response]);

  // Define the gridColumn property dynamically based on screen size
  // const gridColumnValue = useBreakpointValue({ base: 'span 8', md: 'span 8' });

  // Toggle expanded review
  const toggleExpandedReview = (reviewId: number) => {
    setExpandedReviewId((prevId) => (prevId === reviewId ? -1 : reviewId));
  };

  // Fetching data from the API
  const courseReviews = res.reviews;

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
                {courseReviews.map((review, index) => (
                  <CourseReview
                    key={index}
                    review={review}
                    expandedReviewId={expandedReviewId}
                    toggleExpandedReview={toggleExpandedReview}
                  />
                ))}
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
    </Grid>
  );
}
