import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  Heading,
  Box,
  Flex,
  Spacer,
  Button,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { CiBookmark } from 'react-icons/ci';
import Link from 'next/link';
import { useFlexStyle } from '@/styles/styles';

interface IProfessor {
  professor_id: number;
  first_name: string;
  last_name: string;
}

interface ProfessorCardProps {
  professor: IProfessor; // Single professor object
}

export default function ProfessorCard({ professor }: ProfessorCardProps) {
  const flexStyle = useFlexStyle();
  const router = useRouter();
  const [selectedProfessor, setSelectedProfessor] = useState<IProfessor>(professor); // Track selected professor
  const [selectedTermId, setSelectedTermId] = useState(''); // Track selected term ID

  const navigateToProfessor = () => {
    // No term selected; navigate without query parameters
    router.push(`/professors/${selectedProfessor.professor_id}`);
  };

  const handleBookmark = () => {
    alert('Bookmark clicked - Still in development');
  };
  const cardBgColor = useColorModeValue('white', 'grey.700');
  return (
    <Card bgColor={cardBgColor} border={flexStyle.borderColor} borderWidth={1} p={2}>
      <CardHeader p={{ base: '3', sm: '3', md: '3' }}>
        <Flex align="center" gap={2} wrap="wrap">
          <Box>
            <Link href={`/professors/${selectedProfessor.professor_id}`}>
              <Heading
                as="h1"
                color="teal"
                fontSize={{ base: '20', sm: '24', md: '24', lg: '28' }}
                mb={2}
              >
                {selectedProfessor.first_name} {selectedProfessor.last_name}
              </Heading>
            </Link>
          </Box>
          <Spacer />
          <Box color="pink.400">
            <IconButton aria-label="Bookmark" variant="outline" onClick={handleBookmark}>
              <CiBookmark size={20} />
            </IconButton>
          </Box>
        </Flex>
      </CardHeader>
      <Button
        colorScheme="teal"
        variant="outline"
        size="sm"
        onClick={navigateToProfessor}
        mt={2}
        w={'70%'}
        mx={'auto'}
      >
        View Reviews
      </Button>
    </Card>
  );
}
