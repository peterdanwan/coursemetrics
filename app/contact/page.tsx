// app/contact/page.tsx
'use client';
import { Box, Flex, Text, Heading, Link } from '@chakra-ui/react';
import React from 'react';
import Image from 'next/image';
import logo from '@/assets/images/CourseMetricsLogo.png';

export default function About() {
  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      align="center"
      justify="center"
      p={5}
      minHeight="100vh"
    >
      <Box
        flex={{ base: '1', md: '0 1 40%' }}
        textAlign="left"
        mr={{ base: 0, md: 5 }}
        mb={{ base: 5, md: 0 }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box>
          <Heading as="h1" size="2xl">
            Contact Us
          </Heading>
          <Text fontSize="lg" mt={12}>
            Have an issue?
          </Text>
          <Text mt={4}>
            Please send us an email at{' '}
            <Link href="mailto:coursemetrics@helpdesk.com" color="teal.500">
              coursemetrics@helpdesk.com
            </Link>{' '}
            or fill out the form with your issue or feedback.
          </Text>
        </Box>
      </Box>
      <Box
        flex={{ base: '1', md: '0 1 40%' }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {/* Need another image and not the logo */}
        <Image src={logo} alt="CourseMetrics Logo" width={300} height={300} />
      </Box>
    </Flex>
  );
}
