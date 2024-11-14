// components/ProfessorsTable.tsx
'use client';
import { Box, Flex, Stack, Text, Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useFlexStyle } from '@/styles/styles';

const ProfessorsTable: React.FC<{ professors: any[]; onRemove: (professorId: number) => void }> = ({
  professors,
  onRemove,
}) => {
  const router = useRouter();
  const styles = useFlexStyle();
  //console.log('Professors Data: ', professors);

  const displayedProfessors = professors;
  //console.log('Displayed Professors: ', displayedProfessors);

  const handleEditClick = (professorId: number) => {
    router.push(`/admin/manage/edit-professor/${professorId}`);
  };

  if (!displayedProfessors || displayedProfessors.length === 0) {
    return <div>No professors available</div>;
  }

  if (!professors) return <div>Loading...</div>;

  // More logic would need to be added here to remove the professor from the database
  return (
    <>
      {/* Table Header */}
      <Flex
        bg={styles.bgColor}
        p={2}
        borderRadius="md"
        justify="space-between"
        fontWeight="bold"
        color={styles.color}
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
        css={{
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: styles.bgColor,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: styles.borderColor,
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: styles.hoverBg,
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
              bg={styles.cardBg}
            >
              <Flex justify="space-between" align="center">
                <Text flex="5" color={styles.color} m={1}>
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
                    flex="1"
                    mr={{ base: 0, md: 1 }}
                    mb={{ base: 1, md: 0 }}
                    onClick={() => handleEditClick(professor.professor_id)}
                  >
                    Edit
                  </Button>
                  <Button
                    colorScheme="teal"
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
