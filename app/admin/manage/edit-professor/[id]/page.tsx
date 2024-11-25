// app/admin/manage/edit-professor/[id]/page.tsx
'use client';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Flex,
  Heading,
  Text,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import withAdminAuth from '@/components/withAdminAuth';
import { apiFetcher } from '@/utils';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import { useFlexStyle } from '@/styles/styles';

// ******************************************************************************************************************************************************************

export default withAdminAuth(function EditCourse({ user }: { user: any }) {
  const router = useRouter();
  const styles = useFlexStyle();
  const toast = useToast();
  const { id: professorId } = useParams();

  // Local state to manage the form inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  const { data: professorsID, error: professorError } = useSWR(
    `/api/professors/${professorId}`,
    apiFetcher
  );
  //console.log('Professors Data:', professorsID);
  const isLoading = !professorsID;

  useEffect(() => {
    if (professorsID) {
      // Set initial form state when professors data is loaded
      setFirstName(professorsID.data.professor.first_name);
      setLastName(professorsID.data.professor.last_name);
    }
  }, [professorsID]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedProfessor = {
      first_name: firstName,
      last_name: lastName,
      forceUpdate: false,
    };

    setLoading(true);

    try {
      // Send PATCH request to update the professor
      const response = await fetch(`/api/professors/${professorId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfessor),
      });

      const data = await response.json();
      // console.log('Professor updated successfully:', data);
      toast({
        title: `Professor ${professorId} successfully updated`,
        description: `The professor ${updatedProfessor.first_name} ${updatedProfessor.last_name} has been successfully updated.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      router.push('/admin/manage?option=professors');

      if (!response.ok) {
        // Handle the conflict error (duplicate professor)
        if (response.status === 409) {
          const confirmUpdate = window.confirm(
            data.error.message ||
              'Professor with this name already exists. Are you sure you want to proceed?'
          );
          if (confirmUpdate) {
            updatedProfessor.forceUpdate = true;

            // Retry the PATCH request with the updated flag
            const retryResponse = await fetch(`/api/professors/${professorId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(updatedProfessor),
            });

            const retryData = await retryResponse.json();
            // console.log('Professor force updated successfully:', retryData);
            toast({
              title: `Professor ${professorId} successfully updated`,
              description: `The professor ${updatedProfessor.first_name} ${updatedProfessor.last_name} has been successfully updated.`,
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
            if (!retryResponse.ok) {
              throw new Error(data.error.message);
            }
          } else {
            // console.log('Cancelled updating professor');
            router.push(`/admin/manage/edit-professor/${professorId}`);
          }
        }
        throw new Error(data.error.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/manage?option=professors');
  };

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
                    Loading Form...
                </Text>
                </Flex>
            );
            }

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minHeight="100vh"
      bg={styles.bgColor}
      p={5}
    >
      <Box
        width={{ base: '90%', sm: '500px' }}
        borderRadius="lg"
        shadow="md"
        bg={styles.cardBg}
        p={8}
      >
        <Heading as="h1" size="lg" mb={6} textAlign="center" color={styles.headingColor}>
          Edit Professor
        </Heading>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel htmlFor="first-name" color={styles.color}>
                First Name:{' '}
                <Text as="span" color={styles.requiredColor} fontSize="sm">
                  (Required)
                </Text>
              </FormLabel>
              <Input
                id="first-name"
                value={firstName}
                onChange={(e) => {
                  //console.log('Updating firstName to:', e.target.value);
                  setFirstName(e.target.value);
                }}
                required
                color={styles.color}
                focusBorderColor={styles.hoverBg}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="last-name" color={styles.color}>
                Last Name:{' '}
                <Text as="span" color={styles.requiredColor} fontSize="sm">
                  (Required)
                </Text>
              </FormLabel>
              <Input
                id="last-name"
                value={lastName}
                onChange={(e) => {
                  //console.log('Updating lastName to:', e.target.value);
                  setLastName(e.target.value);
                }}
                required
                color={styles.color}
                focusBorderColor={styles.hoverBg}
              />
            </FormControl>
            <Button type="submit" colorScheme="teal" isLoading={loading}>
              Update Professor
            </Button>
            <Button onClick={handleCancel} colorScheme="gray">
              Cancel
            </Button>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
});
