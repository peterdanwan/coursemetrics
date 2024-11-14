// app/admin/manage/get-review/[id]/page.tsx

'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Table,
  Tbody,
  Td,
  Tr,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import Select from 'react-select';
import ReviewsStatusIcon from '@/components/ReviewsStatusIcon';
import withAdminAuth from '@/components/withAdminAuth';
import { apiFetcher } from '@/utils';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import { useFlexStyle } from '@/styles/styles';
import customStyles from '@/styles/customStyles';

export default withAdminAuth(function ReviewDetails({ user }: { user: any }) {
  const styles = useFlexStyle();
  const router = useRouter();
  const toast = useToast();
  const { id: reviewId } = useParams();
  const { data: reviewData, error: reviewError } = useSWR(`/api/reviews/${reviewId}`, apiFetcher);
  const { data: policyData, error: policyError } = useSWR(`/api/policies`, apiFetcher);

  // State to hold the selected policy when it's a pending review
  const [selectedPolicies, setSelectedPolicies] = useState<any[]>([]);

  //console.log('Review Data Get Page:', reviewData);
  //console.log('Policy Data Get Page:', policyData);

  // Handle the change event when a policy is selected
  const handlePolicyChange = (selectedOptions: any) => {
    setSelectedPolicies(selectedOptions || []);
  };

  // Check if the review is pending
  const isPendingReview = reviewData?.data?.review_status_id === 1;

  const handleAccept = async () => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          review_status_id: 2, // 2 means "approved"
          selectedPolicies: selectedPolicies.map((policy) => policy.value), // send only the policy IDs
        }),
      });

      const data = await response.json();
      //console.log('Response Review Approved:', data);

      if (response.ok) {
        // Handle success (e.g., navigate back or show success message)
        console.log('Review approved successfully:', data);
        toast({
          title: 'Review Approved',
          description: `The review id ${reviewId} has been approved successfully.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        router.push('/admin/manage?option=reviews');
      } else {
        // Handle error response
        console.error('Error approving review:', data.message);
      }
    } catch (error) {
      console.error('Error approving review:', error);
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          review_status_id: 3, // 3 means "rejected"
          selectedPolicies: selectedPolicies.map((policy) => policy.value), // send only the policy IDs
        }),
      });

      const data = await response.json();
      //console.log('Response Review Rejected:', data);

      if (response.ok) {
        // Handle success (e.g., navigate back or show success message)
        console.log('Review rejected successfully:', data);
        toast({
          title: 'Review Rejected',
          description: `The review id ${reviewId} has been rejected successfully.`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        router.push('/admin/manage?option=reviews');
      } else {
        // Handle error response
        console.error('Error rejecting review:', data.message);
      }
    } catch (error) {
      console.error('Error rejecting review:', error);
    }
  };

  const sortedReviewQuestions = reviewData?.data?.ReviewQuestions?.sort(
    (a: any, b: any) => a.question_id - b.question_id
  );

  console.log('Sorted Review Questions:', sortedReviewQuestions);

  if (reviewError || policyError) return <div>Failed to load data</div>;
  if (!reviewData || !policyData) return <div>Loading...</div>;

  return (
    <Flex
      direction={['column', 'column', 'row']}
      minHeight="auto"
      bg={styles.bgColor}
      p={8}
      alignItems="flex-start"
    >
      {/* Left section: Review Details */}
      <Box
        flex="2"
        borderRadius="lg"
        shadow="md"
        bg={styles.cardBg}
        p={[4, 6, 8]}
        mr={[0, 0, 16]}
        mb={[4, 6, 0]}
      >
        <Flex justify="space-between" align="center" mb={4}>
          <Heading as="h1" size="lg" mb={4} color={styles.headingColor}>
            Review #{reviewData.data.review_id}
          </Heading>
          <Box mb={4}>
            <ReviewsStatusIcon status={reviewData.data.review_status_id} />
          </Box>
        </Flex>
        <Box mb={4}>
          <Heading as="h2" size="md" mb={4} color={styles.headingColor}>
            Student Information
          </Heading>
          <Text color={styles.color}>
            <Box as="span" fontWeight="bold">
              Name:{' '}
            </Box>
            {reviewData?.data?.User?.full_name}
          </Text>
          <Text color={styles.color}>
            <Box as="span" fontWeight="bold">
              Email:{' '}
            </Box>
            {reviewData?.data?.User?.email}
          </Text>
        </Box>
        <Heading as="h2" size="md" mb={4} color={styles.headingColor}>
          Review Details
        </Heading>
        <Table variant="simple">
          <Tbody>
            {reviewData?.data?.ReviewQuestions?.map((review: any, index: number) => (
              <Tr key={index}>
                <Td color={styles.color} fontWeight="bold">
                  {review.Question.question_text}
                </Td>
                <Td color={styles.color}>{review.ReviewAnswers[0]?.answer}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Right section: Policy Violation and Buttons */}
      <Flex direction="column" flex="1" maxWidth={['100%', '100%', '400px']} alignSelf="stretch">
        <Box borderRadius="lg" shadow="md" bg={styles.cardBg} p={[4, 6, 8]} mb={8}>
          <Heading as="h2" size="lg" mb={4} color={styles.headingColor}>
            Policy Violation
          </Heading>
          <FormControl color={styles.color} mb={6}>
            {isPendingReview ? (
              <>
                <FormLabel>Select Type of Violation:</FormLabel>
                <Select
                  options={policyData.data.map(
                    (policy: {
                      policy_name: string;
                      policy_id: number;
                      policy_description: string;
                    }) => ({
                      label: policy.policy_name,
                      value: policy.policy_id,
                      description: policy.policy_description,
                    })
                  )}
                  onChange={handlePolicyChange}
                  value={selectedPolicies}
                  isMulti
                  getOptionLabel={(e) => e.label} // Return the label as string for React-Select
                  getOptionValue={(e) => e.value.toString()}
                  placeholder="Select Violation Type"
                  styles={customStyles}
                />

                {/* Display descriptions for each selected policy */}
                {selectedPolicies.length > 0 && (
                  <Box mt={4} p={4} bg={styles.bgColor} borderRadius="md">
                    <Heading as="h3" size="md" color={styles.headingColor}>
                      Description:
                    </Heading>
                    <VStack align="start" spacing={4}>
                      {selectedPolicies.map((policy) => (
                        <Box
                          key={policy.value}
                          p={4}
                          bg={styles.policyBgColor}
                          borderRadius="md"
                          width="full"
                        >
                          <Text fontWeight="bold" color={styles.color}>
                            {policy.label}
                          </Text>
                          <Text color={styles.color}>{policy.description}</Text>
                        </Box>
                      ))}
                    </VStack>
                  </Box>
                )}
              </>
            ) : (
              <Box mt={4} bg={styles.bgColor}>
                <VStack align="start" spacing={4} width="full">
                  {reviewData.data.ReviewPolicyViolationLogs?.map((violation: any) => (
                    <Box
                      key={violation.policy_id}
                      p={4}
                      bg={styles.policyBgColor}
                      borderRadius="md"
                      width="full"
                    >
                      <Text fontWeight="bold" color={styles.color}>
                        {violation.Policy.policy_name}
                      </Text>
                      <Text color={styles.color}>{violation.Policy.policy_description}</Text>
                    </Box>
                  ))}
                </VStack>
              </Box>
            )}
          </FormControl>
        </Box>
        {isPendingReview && (
          <Box mt="auto">
            <Button colorScheme="green" onClick={() => handleAccept()} width="full" mb={5} p={6}>
              Accept Review
            </Button>
            <Button colorScheme="red" onClick={handleReject} width="full" p={6}>
              Reject Review
            </Button>
          </Box>
        )}
      </Flex>
    </Flex>
  );
});
