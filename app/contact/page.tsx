// app/contact/page.tsx
'use client';
import { Box, Flex, Text, Heading, Link } from '@chakra-ui/react';
import { EmailIcon, PhoneIcon, InfoIcon } from '@chakra-ui/icons';
import Image from 'next/image';
import React from 'react';
import contactIllustration from '@/assets/images/customerService.jpg';

export default function Contact() {
  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      align="center"
      justify="center"
      p={5}
      minHeight="100vh"
      bg="gray.50" // use "gray.50" for light version and "bg-ourBG" for dark version
    >
      <Box
        flex={{ base: '1', md: '0 1 40%' }}
        textAlign="left"
        mr={{ base: 0, md: 5 }}
        mb={{ base: 5, md: 0 }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={8}
        borderRadius="lg"
        shadow="md"
        bg="white"
        color="black"
      >
        <Box>
          <Heading as="h1" size="2xl" mb={4}>
            Contact Us
          </Heading>
          <Text fontSize="lg" mt={2}>
            We&apos;re here to help!
          </Text>
          <Text mt={4}>
            If you have any questions, concerns, or feedback, please don&apos;t hesitate to reach
            out to us. Your input is invaluable to us.
          </Text>
          <Text mt={4}>
            Email us at{' '}
            <Link href="mailto:coursemetrics@helpdesk.com" color="teal.500">
              coursemetrics@helpdesk.com
            </Link>
            . We respond to inquiries within <strong>24 hours</strong>!
          </Text>
          <Flex alignItems="center" mt={4}>
            <EmailIcon boxSize={5} color="teal.500" />
            <Text ml={2}>
              Email:{' '}
              <Link href="mailto:coursemetrics@helpdesk.com" color="teal.500">
                coursemetrics@helpdesk.com
              </Link>
            </Text>
          </Flex>
          <Flex alignItems="center" mt={2}>
            <PhoneIcon boxSize={5} color="teal.500" />
            <Text ml={2}>Phone: (123) 456-7890</Text>
          </Flex>
          <Text mt={4}>Customer Support Hours: 9 AM - 5 PM (Mon - Fri)</Text>
          <Text mt={4}>Common inquiries include:</Text>
          <Text mt={2} pl={4}>
            • Account issues <br />
            • Technical support <br />
            • Feedback on our services <br />• General questions
          </Text>
          <Text mt={4}>
            We value your feedback! Let us know how we can improve your experience with
            CourseMetrics.
          </Text>
          <Text mt={4}>Connect with us on social media:</Text>
          <Flex direction="column" mt={2}>
            <Flex alignItems="center">
              <InfoIcon boxSize={5} color="teal.500" />
              <Link href="https://twitter.com/yourprofile" color="teal.500" ml={2}>
                Twitter
              </Link>
            </Flex>
            <Flex alignItems="center" mt={1}>
              <InfoIcon boxSize={5} color="teal.500" />
              <Link href="https://facebook.com/yourprofile" color="teal.500" ml={2}>
                Facebook
              </Link>
            </Flex>
            <Flex alignItems="center" mt={1}>
              <InfoIcon boxSize={5} color="teal.500" />
              <Link href="https://instagram.com/yourprofile" color="teal.500" ml={2}>
                Instagram
              </Link>
            </Flex>
          </Flex>
          <Text mt={4}>
            Check our GitHub for more info or to report issues:
            <Link href="https://github.com/yourusername/your-repo" color="teal.500">
              {' '}
              GitHub Repository
            </Link>
          </Text>
          <Text mt={4}>Your feedback helps us serve you better!</Text>
        </Box>
      </Box>
      <Box
        flex={{ base: '1', md: '0 1 40%' }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        mt={{ base: 5, md: 0 }}
      >
        <Image
          src={contactIllustration}
          alt="Contact Us Illustration"
          width={700}
          height={700}
          style={{ borderRadius: '8px' }}
        />
      </Box>
    </Flex>
  );
}
