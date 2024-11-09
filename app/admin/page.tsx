// app/admin/page.tsx
'use client';
import { Box, Flex, Card, CardHeader, CardBody, Heading, Text, Link } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import withAdminAuth from '@/components/withAdminAuth';
import useSWR from 'swr';
import { useFlexStyle } from '@/styles/styles';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
};

export default withAdminAuth(function Admin({ user }: { user: any }) {
  const styles = useFlexStyle();
  const adminName = user?.full_name || 'Admin';

  const { data: professorData, error: professorError } = useSWR('/api/professors', fetcher);
  const { data: courseData, error: courseError } = useSWR('/api/courses', fetcher);
  const { data: reviewData, error: reviewError } = useSWR('/api/reviews', fetcher);
  console.log('Professors Data: ', professorData);
  console.log('Courses Data: ', courseData);
  console.log('Reviews Data: ', reviewData);

  const numberOfProfessors = professorData?.data.totalProfessors || 0;
  const numberOfCourses = courseData?.data.totalCourses || 0;
  const numberOfPendingReviews = reviewData
    ? reviewData.data.filter((review: any) => review.review_status_id === 1).length
    : 0;

  if (courseError || professorError || reviewError) return <div>Failed to load data</div>;
  if (!courseData || !professorData || !reviewData) return <div>Loading...</div>;

  return (
    <Flex
      direction="column"
      justify="flex-start"
      align="center"
      width="100%"
      height="90vh"
      padding={4}
      bg={styles.bgColor}
      color={styles.color}
    >
      {/* Welcome Message */}
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mt={8} mb={4}>
        Welcome {adminName}! You are currently in the Admin Dashboard.
      </Text>

      {/* Card Container */}
      <Flex
        justify="center"
        align="center"
        wrap="wrap"
        width="100%"
        flexGrow={1}
        gap={{ md: '2rem', lg: '6rem' }}
      >
        <Box p={4} flexBasis={{ base: '100%', md: '100%', lg: '23%' }} marginX={2}>
          <Link
            as={NextLink}
            href="/admin/manage?option=courses"
            _hover={{ textDecoration: 'none' }}
          >
            <Card
              bg={styles.cardBg}
              boxShadow="lg"
              borderRadius="md"
              _hover={{ cursor: 'pointer', bg: styles.cardHoverBg }}
            >
              <CardHeader>
                <Text
                  fontSize="5xl"
                  fontWeight="bold"
                  color={styles.cardColor}
                  textAlign="center"
                  my={2}
                >
                  {courseData ? numberOfCourses : 'Loading...'}
                </Text>
              </CardHeader>
              <CardBody>
                <Heading size="md" color={styles.cardColor} textAlign="center">
                  Courses
                </Heading>
              </CardBody>
            </Card>
          </Link>
        </Box>

        <Box p={4} flexBasis={{ base: '100%', md: '100%', lg: '23%' }} marginX={2}>
          <Link
            as={NextLink}
            href="/admin/manage?option=professors"
            _hover={{ textDecoration: 'none' }}
          >
            <Card
              bg={styles.cardBg}
              boxShadow="lg"
              borderRadius="md"
              _hover={{ cursor: 'pointer', bg: styles.cardHoverBg }}
            >
              <CardHeader>
                <Text
                  fontSize="5xl"
                  fontWeight="bold"
                  color={styles.cardColor}
                  textAlign="center"
                  my={2}
                >
                  {professorData ? numberOfProfessors : 'Loading...'}
                </Text>
              </CardHeader>
              <CardBody>
                <Heading size="md" color={styles.cardColor} textAlign="center">
                  Professors
                </Heading>
              </CardBody>
            </Card>
          </Link>
        </Box>

        <Box p={4} flexBasis={{ base: '100%', md: '100%', lg: '23%' }} marginX={2}>
          <Link
            as={NextLink}
            href="/admin/manage?option=reviews"
            _hover={{ textDecoration: 'none' }}
          >
            <Card
              bg={styles.cardBg}
              boxShadow="lg"
              borderRadius="md"
              _hover={{ cursor: 'pointer', bg: styles.cardHoverBg }}
            >
              <CardHeader>
                <Text
                  fontSize="5xl"
                  fontWeight="bold"
                  color={styles.cardColor}
                  textAlign="center"
                  my={2}
                >
                  {reviewData ? numberOfPendingReviews : 'Loading...'}
                </Text>
              </CardHeader>
              <CardBody>
                <Heading size="md" color={styles.cardColor} textAlign="center">
                  In Progress Reviews
                </Heading>
              </CardBody>
            </Card>
          </Link>
        </Box>
      </Flex>
    </Flex>
  );
});
