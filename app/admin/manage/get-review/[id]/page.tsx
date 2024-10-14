// app/admin/manage/get-review/[id]/page.tsx

'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Select,
  Table,
  Tbody,
  Td,
  Tr,
  Text,
} from '@chakra-ui/react';
import ReviewsStatusIcon from '@/components/ReviewsStatusIcon';

interface ReviewDetail {
  question: string;
  answer: string;
}

interface ReviewData {
  id: string;
  studentName: string;
  studentEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewDetails: ReviewDetail[];
}

export default function ReviewDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reviewId = searchParams.get('id');

  const [reviewData, setReviewData] = useState<ReviewData>({
    id: '',
    studentName: '',
    studentEmail: '',
    status: 'pending',
    reviewDetails: [],
  });

  useEffect(() => {
    // Fetch the review data from the backend using reviewId
    const fetchReviewData = async () => {
      // Simulated data fetch
      const review: ReviewData = {
        id: '123',
        studentName: 'student_name',
        studentEmail: 'student_email',
        status: 'pending',
        reviewDetails: [
          { question: 'Title', answer: 'Too much course load' },
          { question: 'Course Name', answer: 'CSP 555' },
          { question: 'Term', answer: 'Winter 2023' },
          { question: 'Course Section', answer: 'N/A' },
          { question: 'Professor', answer: 'Henry Dunfield' },
          { question: 'Worth Time Spent?', answer: 'No' },
          { question: 'Difficulty', answer: '5/5' },
          { question: 'Course Load', answer: '5/5' },
          { question: 'Grade', answer: 'C+' },
          {
            question: 'Other Comments',
            answer:
              'The course content lacked depth and the materials were outdated, which hindered my learning experience.',
          },
        ],
      };
      setReviewData(review);
    };

    fetchReviewData();
  }, [reviewId]);

  const handleAccept = () => {
    // Add logic to accept the review and update the status in the database
    // Post Review to the backend
    console.log('Review accepted');
    router.back();
  };

  const handleReject = () => {
    // Add logic to reject the review and update the status in the database
    console.log('Review rejected');
    router.back();
  };

  return (
    <Flex direction={['column', 'row']} minHeight="auto" bg="gray.50" p={8} alignItems="flex-start">
      {/* Left section: Review Details */}
      <Box flex="2" borderRadius="lg" shadow="md" bg="white" p={8} mr={[0, 16]} mb={[8, 0]}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading as="h1" size="lg" mb={6} color="teal">
            Review #{reviewData.id}
          </Heading>
          <Box mb={4}>
            <ReviewsStatusIcon status={reviewData.status} />
          </Box>
        </Flex>
        <Box mb={4}>
          <Heading as="h2" size="md" mb={4} color="teal">
            Student Information
          </Heading>
          <Text color="black">
            <Box as="span" fontWeight="bold">
              Name:{' '}
            </Box>
            {reviewData.studentName}
          </Text>
          <Text color="black">
            <Box as="span" fontWeight="bold">
              Email:{' '}
            </Box>
            {reviewData.studentEmail}
          </Text>
        </Box>
        <Heading as="h2" size="md" mb={4} color="teal">
          Review Details
        </Heading>
        <Table variant="simple">
          <Tbody>
            {reviewData.reviewDetails.map((review, index) => (
              <Tr key={index}>
                <Td color="black" fontWeight="bold">
                  {review.question}
                </Td>
                <Td color="black">{review.answer}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Right section: Policy Violation and Buttons */}
      <Flex direction="column" flex="1" maxWidth="400px" alignSelf="stretch">
        <Box borderRadius="lg" shadow="md" bg="white" p={8} mb={8}>
          <Heading as="h2" size="lg" mb={6} color="teal">
            Policy Violation
          </Heading>
          <FormControl color="black" mb={6}>
            <FormLabel>Select Type of Violation:</FormLabel>
            <Select placeholder="Select violation type">
              <option value="foul-language">Use of foul language</option>
              <option value="plagiarism">Plagiarism</option>
              <option value="harassment">Harassment</option>
              <option value="cheating">Cheating</option>
              <option value="other">Other</option>
            </Select>
          </FormControl>
        </Box>
        <Box mt="auto">
          <Button colorScheme="green" onClick={handleAccept} width="full" mb={5} p={5} py={8}>
            Accept Review
          </Button>
          <Button colorScheme="red" onClick={handleReject} width="full" p={5} py={8}>
            Reject Review
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
}
