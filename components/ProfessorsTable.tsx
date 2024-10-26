import { Box, Flex, Stack, Text, Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

// Define the Professor type
type Professor = {
  id: number;
  first_name: string;
  last_name: string;
};

// Props interface
interface ProfessorsTableProps {
  professors: Professor[];
}

const ProfessorsTable: React.FC<ProfessorsTableProps> = ({ professors }) => {
  const router = useRouter();

  const handleEditClick = (professorId: number) => {
    router.push(`/admin/manage/edit-professor/${professorId}`);
  };

  return (
    <>
      {/* Table Header */}
      <Flex
        bg="gray.50"
        p={2}
        borderRadius="md"
        justify="space-between"
        fontWeight="bold"
        color="black"
        align="center"
      >
        <Text flex="5" textAlign="left">
          Professor Name
        </Text>
        <Text flex="1" textAlign="left">
          Options
        </Text>
      </Flex>

      {/* Scrollable Stack Container */}
      <Box
        mt={4}
        maxHeight="65vh"
        overflowY="auto"
        p={2}
        css={{
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}
      >
        <Stack spacing={4}>
          {professors.map((professor, index) => (
            <Box key={index} borderWidth="1px" borderRadius="lg" padding={4} bg="gray.50">
              <Flex justify="space-between" align="center">
                {/* Concatenate first name and last name */}
                <Text flex="5" color="black" m={1}>
                  {`${professor.first_name} ${professor.last_name}`}
                </Text>
                <Flex
                  flexDirection={{ base: 'column', md: 'row' }}
                  justifyContent="space-between"
                  m={1}
                  gap={4}
                  flex="1"
                >
                  <Button
                    colorScheme="teal"
                    color="white"
                    flex="1"
                    mr={{ base: 0, md: 1 }}
                    mb={{ base: 1, md: 0 }}
                    onClick={() => handleEditClick(professor.id)}
                  >
                    Edit
                  </Button>
                  <Button colorScheme="teal" color="white" flex="1" ml={{ base: 0, md: 1 }}>
                    Remove
                  </Button>
                </Flex>
              </Flex>
            </Box>
          ))}
        </Stack>
      </Box>
    </>
  );
};

export default ProfessorsTable;
