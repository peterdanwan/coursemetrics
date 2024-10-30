import { Box, Flex, Stack, Text, Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { apiFetcher } from '@/utils';

const ProfessorsTable: React.FC<{ professors: any[]; onRemove: (professorId: number) => void }> = ({
  professors,
  onRemove,
}) => {
  const router = useRouter();
  const { data: professorData, error: professorError } = useSWR('/api/professors', apiFetcher);
  console.log('Professors Data: ', professorData);

  const displayedProfessors = professorData?.data.professors || professors;

  const handleEditClick = (professorId: number) => {
    router.push(`/admin/manage/edit-professor/${professorId}`);
  };

  if (professorError) return <div>Failed to load professors</div>;
  if (!professorData) return <div>Loading...</div>;

  // More logic would need to be added here to remove the professor from the database
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
          {displayedProfessors.map((professor: any) => (
            <Box
              key={professor.professor_id}
              borderWidth="1px"
              borderRadius="lg"
              padding={4}
              bg="gray.50"
            >
              <Flex justify="space-between" align="center">
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
                    onClick={() => handleEditClick(professor.professor_id)}
                  >
                    Edit
                  </Button>
                  <Button
                    colorScheme="teal"
                    color="white"
                    flex="1"
                    ml={{ base: 0, md: 1 }}
                    onClick={() => onRemove(professor.professor_id)}
                  >
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
