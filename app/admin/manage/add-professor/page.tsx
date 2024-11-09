// app/admin/manage/add-professor/page.tsx

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
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import withAdminAuth from '@/components/withAdminAuth';

export default withAdminAuth(function AdminAddCourse({ user }: { user: any }) {
  const router = useRouter();

  // State to manage form input and possible error/success messages
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset previous messages
    setLoading(true);

    // Create the professor object to be sent in the POST request
    const professorData = {
      first_name: firstName,
      last_name: lastName,
    };

    try {
      // Send POST request to the backend API
      const response = await fetch('/api/professors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(professorData),
      });

      const data = await response.json();
      console.log('Professor successfully created:', data);
      router.push('/admin/manage');

      if (response.status === 409) {
        // If the professor already exists, ask for confirmation to add as a new professor
        const proceed = window.confirm(
          `Professor ${firstName} ${lastName} already exists. Do you want to add this professor as a new record?`
        );

        if (proceed) {
          // Send a second request with a flag or additional data to create the new professor
          const createNewResponse = await fetch('/api/professors', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              first_name: firstName,
              last_name: lastName,
              is_duplicate: true, // Custom flag to indicate a duplicate professor
            }),
          });

          const createNewData = await createNewResponse.json();
          console.log('New professor added despite duplication:', createNewData);
          router.push('/admin/manage?option=professors');

          if (!createNewResponse.ok) {
            throw new Error(data.error.message);
          }
        } else {
          console.log('Cancelled adding professor');
          router.push('/admin/manage/add-professor');
        }
      }

      if (!response.ok) {
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

  return (
    <Flex direction="column" align="center" justify="center" minHeight="100vh" bg="gray.50" p={5}>
      <Box width={{ base: '90%', sm: '500px' }} borderRadius="lg" shadow="md" bg="white" p={8}>
        <Heading as="h1" size="lg" mb={6} textAlign="center" color="teal">
          Add New Professor
        </Heading>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel htmlFor="professor-first-name" color="black">
                First Name:
              </FormLabel>
              <Input
                id="professor-first-name"
                placeholder="Enter professor first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                color="black"
                required
                focusBorderColor="#008080"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="professor-last-name" color="black">
                Last Name:
              </FormLabel>
              <Input
                id="professor-last-name"
                placeholder="Enter professor last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                color="black"
                required
                focusBorderColor="#008080"
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="teal"
              color="white"
              isLoading={loading}
              loadingText="Adding Professor"
            >
              Add Professor
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
