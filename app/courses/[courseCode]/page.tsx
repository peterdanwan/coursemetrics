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
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

export default function CoursePage({ params }: { params: { courseCode: string } }) {
  const courseCode = params.courseCode;
  const [expandedReviewId, setExpandedReviewId] = useState(-1);

  // Toggle expanded review
  const toggleExpandedReview = (reviewId: number) => {
    setExpandedReviewId(expandedReviewId === reviewId ? -1 : reviewId);
  };

  return (
    <Grid templateColumns="2fr 1fr" gap={6} p={5}>
      {/* Course Details Section*/}
      <GridItem>
        <Card>
          <CardHeader>
            <Flex align="center">
              <Box>
                <Heading>CCP555</Heading>
                <Heading>Cloud Computing for Programmers</Heading>
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
      <GridItem>
        <Card>
          <CardHeader>
            <Heading>Skills</Heading>
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
      <GridItem>
        <Card>
          <CardHeader>
            <Flex align="center">
              <Heading as="h2">Reviews</Heading>
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
              <Card key={1}>
                <CardHeader>
                  <Heading as="h3" size="lg">
                    Great Course
                  </Heading>
                </CardHeader>
                <CardBody>
                  <Grid templateColumns="repeat(5, 1fr)" gap={3}>
                    <GridItem colSpan={4}>
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
                      <Button
                        variant="link"
                        onClick={() => toggleExpandedReview(1)}
                        textAlign="right"
                      >
                        {expandedReviewId === 1 ? 'See Less' : 'See More'}
                      </Button>
                    </GridItem>
                    <GridItem textAlign="right">
                      <p>Would take again: Yes</p>
                      <p>Difficulty: 3/5</p>
                      <p>Course Load: 4/5</p>
                      <p>Grade: A+</p>
                    </GridItem>
                    <GridItem colSpan={4}>
                      <p>Professor: David Humphrey</p>
                    </GridItem>
                    <GridItem textAlign="right">Bookmark</GridItem>
                  </Grid>
                </CardBody>
              </Card>
              {/* Course Review Component */}
              <Card key={2}>
                <CardHeader>
                  <Heading as="h3" size="lg">
                    Too much course load
                  </Heading>
                </CardHeader>
                <CardBody>
                  <Grid templateColumns="repeat(5, 1fr)" gap={3}>
                    <GridItem colSpan={4}>
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
                      <Button
                        variant="link"
                        onClick={() => toggleExpandedReview(2)}
                        textAlign="right"
                      >
                        {expandedReviewId === 2 ? 'See Less' : 'See More'}
                      </Button>
                    </GridItem>
                    <GridItem textAlign="right">
                      <p>Would take again: No</p>
                      <p>Difficulty: 5/5</p>
                      <p>Course Load: 5/5</p>
                      <p>Grade: C+</p>
                    </GridItem>
                    <GridItem colSpan={4}>
                      <p>Professor: Havey Dumfred</p>
                    </GridItem>
                    <GridItem textAlign="right">Bookmarked</GridItem>
                  </Grid>
                </CardBody>
              </Card>
            </Flex>
          </CardBody>
        </Card>
      </GridItem>
      {/* Quick Stats Section */}
      <GridItem>
        <Card>
          <CardHeader>
            <Heading>Quick Stats</Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns="repeat(3, 1fr)">
              <GridItem>
                <Text>Difficulty:</Text>
              </GridItem>
              <GridItem colSpan={2}>
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
              </GridItem>

              <GridItem>Course Load:</GridItem>
              <GridItem colSpan={2}>
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
              </GridItem>

              <GridItem>Average Grade:</GridItem>
              <GridItem colSpan={2}>
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
              </GridItem>

              <GridItem>Would Take Again:</GridItem>
              <GridItem colSpan={2}>
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
      <GridItem>
        <Card>
          <CardHeader>
            <Heading>Prerequisites</Heading>
          </CardHeader>
          <CardBody>
            <Box>
              <Text>WEB422</Text>
              <Text>Web Programming for Apps and Services</Text>
            </Box>
            <Box>
              <Text>BTI425</Text>
              <Text>Web Programming for Apps and Services</Text>
            </Box>
          </CardBody>
        </Card>
      </GridItem>
      {/* Add Review Button */}
      <Button colorScheme="teal" variant="solid">
        Add Review
      </Button>
    </Grid>
  );
}
