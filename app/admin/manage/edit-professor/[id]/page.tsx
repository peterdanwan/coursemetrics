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
  Textarea,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import withAdminAuth from '@/components/withAdminAuth';
import { apiFetcher } from '@/utils';
import useSWR from 'swr';
import { useParams } from 'next/navigation';

// ******************************************************************************************************************************************************************

export default withAdminAuth(function EditCourse({ user }: { user: any }) {
  const router = useRouter();
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
      console.log('Professor updated successfully:', data);
      router.push('/admin/manage?option=professors');

      if (!response.ok) {
        // Handle the conflict error (duplicate professor)
        if (response.status === 409) {
          const confirmUpdate = window.confirm(
            data.error.message || 'Are you sure you want to proceed?'
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
            console.log('Professor force updated successfully:', retryData);
            if (!retryResponse.ok) {
              throw new Error(data.error.message);
            }
          } else {
            console.log('Cancelled updating professor');
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

  if (professorError) return <div>Failed to load data</div>;
  if (!professorsID) return <div>Loading...</div>;

  return (
    <Flex direction="column" align="center" justify="center" minHeight="100vh" bg="gray.50" p={5}>
      <Box width={{ base: '90%', sm: '500px' }} borderRadius="lg" shadow="md" bg="white" p={8}>
        <Heading as="h1" size="lg" mb={6} textAlign="center" color="teal">
          Edit Professor
        </Heading>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel htmlFor="first-name" color="black">
                First Name:
              </FormLabel>
              <Input
                id="first-name"
                value={firstName}
                onChange={(e) => {
                  //console.log('Updating firstName to:', e.target.value);
                  setFirstName(e.target.value);
                }}
                required
                color="black"
                focusBorderColor="teal"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="last-name" color="black">
                Last Name:
              </FormLabel>
              <Input
                id="last-name"
                value={lastName}
                onChange={(e) => {
                  //console.log('Updating lastName to:', e.target.value);
                  setLastName(e.target.value);
                }}
                required
                color="black"
                focusBorderColor="teal"
              />
            </FormControl>
            <Button type="submit" colorScheme="teal" color="white" isLoading={loading}>
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
