// components/Footer/MainFooter.tsx
'use client';
import { Box, Container, Text, Flex, Link, IconButton, useColorModeValue } from '@chakra-ui/react';
import { FaFacebook, FaGithub, FaXTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa6';
import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useFlexStyle } from '@/styles/styles';

export default function MainFooter() {
  const { user, error, isLoading }: any = useUser();
  console.log('User: ', user?.name);
  const flexStyle = useFlexStyle();

  // Boilerplate code for useUser (from Auth0)
  if (isLoading) return <div></div>;
  if (error) return <div>{error.message}</div>;

  return (
    <Box
      bg={flexStyle.bgColor}
      color={flexStyle.color}
      py={6}
      borderTop="1px solid"
      borderColor={flexStyle.borderColor}
    >
      <Container maxW="6xl">
        <Flex direction="column" align="center" w="100%">
          {/* Links Section */}
          <Flex
            w="100%"
            maxW="6xl"
            justify="space-between"
            mb={4}
            px={6}
            direction={{ base: 'column', md: 'row' }} // Stack links vertically on small screens
            align={{ base: 'center', md: 'flex-start' }} // Center links on small screens
            textAlign={{ base: 'center', md: 'left' }} // Center text on small screens
          >
            <Link href="/about" mb={{ base: 2, md: 0 }}>
              About
            </Link>
            <Link href="/contact" mb={{ base: 2, md: 0 }}>
              Contact Us
            </Link>
            <Link href="/faq" mb={{ base: 2, md: 0 }}>
              FAQ
            </Link>
            <Link href="/terms" mb={{ base: 2, md: 0 }}>
              Terms & Conditions
            </Link>
          </Flex>

          {/* Social Media Icons Section */}
          <Flex
            justify="center"
            mb={4}
            wrap="wrap" // Allow wrapping on small screens
          >
            <IconButton
              as="a"
              href="https://facebook.com"
              aria-label="Facebook"
              icon={<FaFacebook size={45} />}
              variant="ghost"
              size="lg"
              isRound
              _hover={{ bg: flexStyle.bgColor }}
              mx={3}
              mb={{ base: 2, md: 0 }} // Adjust spacing for small screens
            />
            <IconButton
              as="a"
              href="https://github.com"
              aria-label="Github"
              icon={<FaGithub size={45} />}
              variant="ghost"
              size="lg"
              isRound
              _hover={{ bg: flexStyle.bgColor }}
              mx={3}
              mb={{ base: 2, md: 0 }}
            />
            <IconButton
              as="a"
              href="https://twitter.com"
              aria-label="Twitter"
              icon={<FaXTwitter size={45} />}
              variant="ghost"
              size="lg"
              isRound
              _hover={{ bg: flexStyle.bgColor }}
              mx={3}
              mb={{ base: 2, md: 0 }}
            />
            <IconButton
              as="a"
              href="https://linkedin.com"
              aria-label="Linkedin"
              icon={<FaLinkedin size={45} />}
              variant="ghost"
              size="lg"
              isRound
              _hover={{ bg: flexStyle.bgColor }}
              mx={3}
              mb={{ base: 2, md: 0 }}
            />
            <IconButton
              as="a"
              href="https://instagram.com"
              aria-label="Instagram"
              icon={<FaInstagram size={45} />}
              variant="ghost"
              size="lg"
              isRound
              _hover={{ bg: flexStyle.bgColor }}
              mx={3}
              mb={{ base: 2, md: 0 }}
            />
          </Flex>

          {/* Copyright Section */}
          <Text fontSize="sm" textAlign="center">
            © {new Date().getFullYear()} CourseMetrics, LLC, All rights reserved.
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}
