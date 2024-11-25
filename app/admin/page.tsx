// app/admin/page.tsx
'use client';
import {
  Box,
  Flex,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Link,
  Spinner,
} from '@chakra-ui/react';
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
  // console.log('Professors Data: ', professorData);
  // console.log('Courses Data: ', courseData);
  // console.log('Reviews Data: ', reviewData);

  const isLoading = !professorData || !courseData || !reviewData;

  const numberOfProfessors = professorData?.data.totalProfessors || 0;
  const numberOfCourses = courseData?.data.totalCourses || 0;
  const numberOfPendingReviews = reviewData ? reviewData.data.filter((review: any) => review.review_status_id === 1).length: 0;
  
    // Loading Spinner
    if (isLoading) {
        return (
            <Flex
            direction="column"
            justify="center"
            align="center"
            width="100%"
            height="90vh"
            bg={styles.bgColor}
            color={styles.color}
            >
            <Spinner size="xl" />
            <Text fontSize="lg" mt={4}>
                Loading Dashboard...
            </Text>
            </Flex>
        );
        }

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
                  {courseData ? numberOfCourses : 0}
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
                  {professorData ? numberOfProfessors : 0}
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
                  {reviewData ? numberOfPendingReviews : 0}
                </Text>
              </CardHeader>
              <CardBody>
                <Heading size="md" color={styles.cardColor} textAlign="center">
                  Pending Reviews
                </Heading>
              </CardBody>
            </Card>
          </Link>
        </Box>
      </Flex>
    </Flex>
  );
});
