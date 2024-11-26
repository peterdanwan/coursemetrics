// components/Footer/MainFooter.tsx
'use client';
import { Box, Container, Text, Flex, IconButton, useColorModeValue } from '@chakra-ui/react';
import { FaFacebook, FaGithub, FaXTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa6';
import React from 'react';
import { useFlexStyle } from '@/styles/styles';
import Link from 'next/link';

export default function MainFooter() {
  const flexStyle = useFlexStyle();

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
            direction={{ base: 'column', md: 'row' }}
            align={{ base: 'center', md: 'flex-start' }}
            textAlign={{ base: 'center', md: 'left' }}
          >
            <Link href="/">
              <Text _hover={{ textDecoration: 'underline' }}>Home</Text>
            </Link>
            <Link href="/about">
              <Text _hover={{ textDecoration: 'underline' }}>About</Text>
            </Link>
            <Link href="/contact">
              <Text _hover={{ textDecoration: 'underline' }}>Contact Us</Text>
            </Link>
            <Link href="/faq">
              <Text _hover={{ textDecoration: 'underline' }}>FAQ</Text>
            </Link>
          </Flex>

          {/* Social Media Icons Section */}
          <Flex justify="center" mb={4} wrap="wrap">
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
              mb={{ base: 2, md: 0 }}
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
