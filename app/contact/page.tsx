// app/contact/page.tsx
'use client';
import {
  Box,
  Flex,
  Text,
  Heading,
  Link,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import Image from 'next/image';
import logo from '@/assets/images/CourseMetricsLogo.png';

export default function About() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Implement your email sending logic here
    console.log('Form submitted:', formData);
  };

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
        {/* Background Image */}
        <Image
          src={logo}
          alt="CourseMetrics Logo"
          // objectFit="cover"
          width={300}
          height={300}
          // z-index={-1}
        />
        {/* Form */}
        {/* <Box as="form" onSubmit={handleSubmit} width="100%">
          <FormControl id="name" isRequired mb={4}>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              width={{ base: '100%', md: '80%', lg: '90%' }}
              size="lg"
            />
          </FormControl>
          <FormControl id="email" isRequired mb={4}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              width={{ base: '100%', md: '80%', lg: '90%' }}
              size="lg"
            />
          </FormControl>
          <FormControl id="message" isRequired mb={4}>
            <FormLabel>Message</FormLabel>
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              width={{ base: '100%', md: '80%', lg: '90%' }}
              height={{ base: '150px', md: '200px' }}
              size="lg"
            />
          </FormControl>
          <Button type="submit" colorScheme="teal" width={{ base: '100%', md: 'auto' }}>
            Send
          </Button>
        </Box> */}
      </Box>
    </Flex>
  );
}
