'use client';
import {
  Box,
  Flex,
  Stack,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Select,
} from '@chakra-ui/react';
import StatusIcon from '@/components/StatusIcon';
import { useState } from 'react';

const Bookmark = () => {
  return (
    <Box>
      <Heading as="h1">My Bookmarked Reviews</Heading>
      <Flex alignItems="centre" justifyContent="centre" gap={2}>
        <Text as="label" htmlFor="reviews-filter" m="0" py="2" verticalAlign="middle">
          Filter
        </Text>
        <Select placeholder="Select category..." id="reviews-filter">
          <option value="course">Course</option>
          <option value="professor">Professor</option>
          <option value="professor">Review</option>
        </Select>
      </Flex>
      <Flex></Flex>
    </Box>
  );
};

const BookmarkItem = () => {
  return <></>;
};

export default Bookmark;
