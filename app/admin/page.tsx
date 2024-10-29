// app/admin/page.tsx
'use client';
import { Box, Flex, Card, CardHeader, CardBody, Heading, Text, Link } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import withAdminAuth from '@/components/withAdminAuth';

export default withAdminAuth(function Admin({ user }: { user: any }) {
  const adminName = user?.full_name || 'Admin';

  return (
    <Flex
      direction="column"
      justify="flex-start"
      align="center"
      width="100%"
      height="90vh"
      padding={4}
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
              bg="gray.700"
              boxShadow="lg"
              borderRadius="md"
              _hover={{ cursor: 'pointer', bg: 'teal.600' }}
            >
              <CardHeader>
                <Text fontSize="5xl" fontWeight="bold" color="white" textAlign="center" my={2}>
                  40 {/* {numberOfCourses} Replace with the actual number of courses */}
                </Text>
              </CardHeader>
              <CardBody>
                <Heading size="md" color="gray.200" textAlign="center">
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
              bg="gray.700"
              boxShadow="lg"
              borderRadius="md"
              _hover={{ cursor: 'pointer', bg: 'teal.600' }}
            >
              <CardHeader>
                <Text fontSize="5xl" fontWeight="bold" color="white" textAlign="center" my={2}>
                  10 {/* {numberOfProfessors} Replace with the actual number of professors */}
                </Text>
              </CardHeader>
              <CardBody>
                <Heading size="md" color="gray.200" textAlign="center">
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
              bg="gray.700"
              boxShadow="lg"
              borderRadius="md"
              _hover={{ cursor: 'pointer', bg: 'teal.600' }}
            >
              <CardHeader>
                <Text fontSize="5xl" fontWeight="bold" color="white" textAlign="center" my={2}>
                  5 {/* {numberOfReviews} Replace with the actual number of reviews */}
                </Text>
              </CardHeader>
              <CardBody>
                <Heading size="md" color="gray.200" textAlign="center">
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
