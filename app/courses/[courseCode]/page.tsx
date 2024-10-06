// app/courses/[courseCode]/page.tsx

'use client';
import { useState } from 'react';
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
  useBreakpointValue,
  Stack,
  StackDivider,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

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
      professor: 'Havey Dumfred',
      bookmark: true,
    },
    {
      id: 3,
      title: 'Course is too hard',
      content: [
        'CCP555 is a well-rounded course for programmers interested in cloud computing. The curriculum is well-structured, beginning with cloud fundamentals and gradually moving towards more complex topics like microservices and DevOps practices. The hands-on labs were a highlight, allowing us to work directly with AWS and Docker, making the learning experience very practical. One of the strengths of the course is its focus on scalability and security in cloud environments, which are critical in real-world applications.',
        'The instructor’s explanations were clear, although the pacing was sometimes too fast, particularly in the sections on serverless computing. Despite that, the course provided ample resources to catch up. I highly recommend CCP555 to anyone looking to expand their skill set in cloud technologies.',
      ],
      wouldTakeAgain: 'No',
      difficulty: 5,
      courseLoad: 5,
      grade: 'C+',
      professor: 'Havey Dumfred',
      bookmark: true,
    },
  ],
};

export default function CoursePage({ params }: { params: { courseCode: string } }) {
  const courseCode = params.courseCode;
  const [expandedReviewId, setExpandedReviewId] = useState(-1);

  // Define the gridColumn property dynamically based on screen size
  const gridColumnValue = useBreakpointValue({ base: 'span 3', md: 'span 8' });

  // Toggle expanded review
  // const toggleExpandedReview = (reviewId: number) => {
  //   setExpandedReviewId(expandedReviewId === reviewId ? -1 : reviewId);
  // };
  const toggleExpandedReview = (reviewId: number) => {
    setExpandedReviewId((prevId) => (prevId === reviewId ? -1 : reviewId));
  };

  // Fetching data from the API
  const courseReviews = res.reviews;

  return (
    <Grid
      // gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))"
      gridTemplateColumns="repeat(12, 1fr)"
      gap={6}
      p={5}
      width="100%"
      maxWidth={1800}
      margin="0 auto"
    >
      {/* Course Details Section*/}
      {/* span 80% on medium screens, span 3 columns on small screens */}
      <GridItem gridColumn={gridColumnValue}>
        <Card>
          <CardHeader>
            <Flex align="center" wrap="wrap">
              <Box>
                <Heading as="h1" color="teal">
                  CCP555
                </Heading>
                <Heading as="h2" size="lg" color="teal">
                  Cloud Computing for Programmers
                </Heading>
              </Box>
              <Spacer />
              <Box>
                <Flex gap={5}>
                  <Text>Bookmark</Text>
                  <Text>4.5/5</Text>
                </Flex>
              </Box>
            </Flex>
          </CardHeader>
          <CardBody>
            <Text>
              Explore modern cloud application development through hands-on labs and projects,
              focusing on technologies, patterns, tools, and best practices for building
              distributed, reliable, and scalable applications on platforms like AWS and Azure
            </Text>
          </CardBody>
        </Card>
      </GridItem>
      {/* Skills Section */}
      <GridItem gridColumn={{ base: 'span 9', md: 'span 4' }}>
        <Card>
          <CardHeader>
            <Heading color="teal">Skills</Heading>
          </CardHeader>
          <CardBody>
            <List listStyleType="none">
              <Flex wrap="wrap">
                <ListItem>
                  <Tag>AWS</Tag>
                </ListItem>
                <ListItem>
                  <Tag>Cloud Computing</Tag>
                </ListItem>
                <ListItem>
                  <Tag>JavaScript</Tag>
                </ListItem>
                <ListItem>
                  <Tag>HTML</Tag>
                </ListItem>
              </Flex>
            </List>
          </CardBody>
        </Card>
      </GridItem>
      {/* Course Reviews Section: make it scrollable too see more reviews */}
      <GridItem gridColumn={gridColumnValue} gridRow="span 4">
        <Card>
          <CardHeader>
            <Flex align="center">
              <Heading as="h2" color="teal">
                Reviews
              </Heading>
              <Spacer />
              <Box>
                <Text>
                  Filter by: <span>[Professor]</span>
                </Text>
              </Box>
            </Flex>
          </CardHeader>
          <CardBody>
            <Flex direction="column" gap={5}>
              {/* Course Review Component: "key" is to store review id */}
              <Stack
                divider={<StackDivider />}
                height="700px"
                overflowY="scroll"
                spacing="4"
                css={{
                  // For Chrome, Safari, and other WebKit browsers
                  '&::-webkit-scrollbar': {
                    width: '12px', // Width of the scrollbar
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1', // Background of the scrollbar track
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#cdcdcd', // Color of the scrollbar thumb
                    borderRadius: '6px', // Rounded corners for the thumb
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: '#555', // Color when hovering over the scrollbar
                  },

                  // For Firefox
                  'scrollbar-width': 'thin', // Makes the scrollbar thinner
                  'scrollbar-color': '#cdcdcd #f1f1f1', // Thumb and track color
                }}
              >
                <Box key={1} p={5}>
                  {/* <CardHeader> */}
                  <Heading as="h3" size="lg" color="blackAlpha.600" pb={5}>
                    Great Course
                  </Heading>
                  {/* </CardHeader> */}
                  {/* <CardBody> */}
                  <Grid templateColumns="repeat(5, 1fr)" gap={2}>
                    <GridItem gridColumn="span 4">
                      <Text noOfLines={expandedReviewId === 1 ? 0 : 3}>
                        <span>
                          CCP555 offers a comprehensive introduction to cloud computing for
                          programmers. The course dives deep into popular cloud platforms like AWS
                          and Microsoft Azure, providing hands-on labs that help reinforce key
                          concepts like virtual machines, containers, and cloud storage. I
                          appreciated the real-world examples, as they gave context to abstract
                          topics like Infrastructure as a Service (IaaS) and Platform as a Service
                          (PaaS).{' '}
                        </span>
                        <br />
                        <span>
                          The assignments were challenging but rewarding, especially those that
                          involved setting up scalable cloud solutions. By the end of the course, I
                          felt comfortable deploying web applications and databases in a cloud
                          environment. However, some modules felt rushed, and I think the course
                          could benefit from a bit more time spent on Kubernetes. Overall, CCP555 is
                          a solid course that equips you with the skills necessary to work with
                          cloud technologies.{' '}
                        </span>
                      </Text>
                    </GridItem>

                    <GridItem textAlign="right">
                      <p>Would take again: Yes</p>
                      <p>Difficulty: 3/5</p>
                      <p>Course Load: 4/5</p>
                      <p>Grade: A+</p>
                    </GridItem>
                    <GridItem gridColumn={4} justifySelf="end">
                      <Button variant="link" onClick={() => toggleExpandedReview(1)} color="teal">
                        {expandedReviewId === 1 ? 'See Less' : 'See More'}
                      </Button>
                    </GridItem>
                    <GridItem gridColumn="span 4">
                      <p>Professor: David Humphrey</p>
                    </GridItem>
                    <GridItem textAlign="right">Bookmark</GridItem>
                  </Grid>
                  {/* </CardBody> */}
                </Box>
                {/* Course Review Component */}
                <Box key={2} p={5}>
                  <Heading as="h3" size="lg" color="blackAlpha.600" pb={5}>
                    Too much course load
                  </Heading>
                  <Grid templateColumns="repeat(5, 1fr)" gap={2}>
                    <GridItem gridColumn="span 4">
                      <Text noOfLines={expandedReviewId === 2 ? 0 : 3}>
                        <span>
                          CCP555 is a well-rounded course for programmers interested in cloud
                          computing. The curriculum is well-structured, beginning with cloud
                          fundamentals and gradually moving towards more complex topics like
                          microservices and DevOps practices. The hands-on labs were a highlight,
                          allowing us to work directly with AWS and Docker, making the learning
                          experience very practical. One of the strengths of the course is its focus
                          on scalability and security in cloud environments, which are critical in
                          real-world applications.{' '}
                        </span>
                        <br />
                        <span>
                          The instructor’s explanations were clear, although the pacing was
                          sometimes too fast, particularly in the sections on serverless computing.
                          Despite that, the course provided ample resources to catch up. I highly
                          recommend CCP555 to anyone looking to expand their skill set in cloud
                          technologies.{' '}
                        </span>
                      </Text>
                    </GridItem>
                    <GridItem textAlign="right">
                      <p>Would take again: No</p>
                      <p>Difficulty: 5/5</p>
                      <p>Course Load: 5/5</p>
                      <p>Grade: C+</p>
                    </GridItem>
                    <GridItem gridColumn={4} justifySelf="end">
                      <Button variant="link" onClick={() => toggleExpandedReview(1)} color="teal">
                        {expandedReviewId === 2 ? 'See Less' : 'See More'}
                      </Button>
                    </GridItem>
                    <GridItem gridColumn="span 4">
                      <p>Professor: Havey Dumfred</p>
                    </GridItem>
                    <GridItem textAlign="right">Bookmarked</GridItem>
                  </Grid>
                </Box>
                {/* Course Review Component */}
                <Box key={3} p={5}>
                  <Heading as="h3" size="lg" color="blackAlpha.600" pb={5}>
                    Course is too hard
                  </Heading>
                  <Grid templateColumns="repeat(5, 1fr)" gap={2}>
                    <GridItem gridColumn="span 4">
                      <Text noOfLines={expandedReviewId === 2 ? 0 : 3}>
                        <span>
                          CCP555 is a well-rounded course for programmers interested in cloud
                          computing. The curriculum is well-structured, beginning with cloud
                          fundamentals and gradually moving towards more complex topics like
                          microservices and DevOps practices. The hands-on labs were a highlight,
                          allowing us to work directly with AWS and Docker, making the learning
                          experience very practical. One of the strengths of the course is its focus
                          on scalability and security in cloud environments, which are critical in
                          real-world applications.{' '}
                        </span>
                        <br />
                        <span>
                          The instructor’s explanations were clear, although the pacing was
                          sometimes too fast, particularly in the sections on serverless computing.
                          Despite that, the course provided ample resources to catch up. I highly
                          recommend CCP555 to anyone looking to expand their skill set in cloud
                          technologies.{' '}
                        </span>
                      </Text>
                    </GridItem>
                    <GridItem textAlign="right">
                      <p>Would take again: No</p>
                      <p>Difficulty: 5/5</p>
                      <p>Course Load: 5/5</p>
                      <p>Grade: C+</p>
                    </GridItem>
                    <GridItem gridColumn={4} justifySelf="end">
                      <Button variant="link" onClick={() => toggleExpandedReview(1)} color="teal">
                        {expandedReviewId === 3 ? 'See Less' : 'See More'}
                      </Button>
                    </GridItem>
                    <GridItem gridColumn="span 4">
                      <p>Professor: Havey Dumfred</p>
                    </GridItem>
                    <GridItem textAlign="right">Bookmarked</GridItem>
                  </Grid>
                </Box>
              </Stack>
              <Button
                colorScheme="teal"
                variant="solid"
                size="lg"
                width="200px"
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
      <GridItem gridColumn={{ base: 'span 9', md: 'span 4' }}>
        <Card>
          <CardHeader>
            <Heading color="teal">Quick Stats</Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns="repeat(2, 1fr)" gap={2}>
              <GridItem>
                <Text>Difficulty:</Text>
              </GridItem>
              <GridItem>
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
              </GridItem>

              <GridItem>Course Load:</GridItem>
              <GridItem>
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
              </GridItem>

              <GridItem>Average Grade:</GridItem>
              <GridItem>
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
              </GridItem>

              <GridItem>Would Take Again:</GridItem>
              <GridItem>
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
              </GridItem>
            </Grid>
          </CardBody>
        </Card>
      </GridItem>
      {/* Prerequisites Section */}
      <GridItem gridColumn={{ base: 'span 9', md: 'span 4' }}>
        <Card>
          <CardHeader>
            <Heading color="teal">Prerequisites</Heading>
          </CardHeader>
          <CardBody>
            <Box>
              <Text>WEB422 - Web Programming for Apps and Services</Text>
            </Box>
            <Box>
              <Text>BTI425 - Web Programming for Apps and Services</Text>
            </Box>
          </CardBody>
        </Card>
      </GridItem>
      {/* Add Review Button
      <GridItem>
        <Button colorScheme="teal" variant="solid">
          Add Review
        </Button>
      </GridItem> */}
    </Grid>
  );
}

interface Review {
  id: number;
  title: string;
  content: string[];
  wouldTakeAgain: string;
  difficulty: number;
  courseLoad: number;
  grade: string;
  professor: string;
  bookmark: boolean;
}

function CourseReview({ key, review, expanded }: { key: number; review: Review; expanded: number;  }) {
  return (
    <div>
      <Box key={review.id} p={5}>
        {/* <CardHeader> */}
        <Heading as="h3" size="lg" color="blackAlpha.600" pb={5}>
          {review.title}
        </Heading>
        {/* </CardHeader> */}
        {/* <CardBody> */}
        <Grid templateColumns="repeat(5, 1fr)" gap={2}>
          <GridItem gridColumn="span 4">
            <Text noOfLines={expandedReviewId === 1 ? 0 : 3}>{review.content}</Text>
          </GridItem>

          <GridItem textAlign="right">
            <p>
              <span>Would take again:</span> {review.wouldTakeAgain}
            </p>
            <p>
              <span>Difficulty:</span> {review.difficulty}/5
            </p>
            <p>
              <span>Course Load:</span> {review.courseLoad}/5
            </p>
            <p>
              <span>Grade:</span> {review.grade}
            </p>
          </GridItem>
          <GridItem gridColumn={4} justifySelf="end">
            <Button variant="link" onClick={() => toggleExpandedReview(1)} color="teal">
              {expandedReviewId === 1 ? 'See Less' : 'See More'}
            </Button>
          </GridItem>
          <GridItem gridColumn="span 4">
            <p>Professor: David Humphrey</p>
          </GridItem>
          <GridItem textAlign="right">{review.bookmark ? 'Bookmarked' : 'Bookmark'}</GridItem>
        </Grid>
        {/* </CardBody> */}
      </Box>
    </div>
  );
}
