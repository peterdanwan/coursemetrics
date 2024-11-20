// app/professors/page.tsx

'use client';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { useSearchParams } from 'next/navigation';
import {
  Grid,
  GridItem,
  Box,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  Flex,
  Center,
} from '@chakra-ui/react';
import ProfessorCard from '@/components/ProfessorCard'; // Ensure the path is correct
import { apiFetcher } from '@/utils';
import { useFlexStyle } from '@/styles/styles';
import { set } from 'react-hook-form';
import NotFound from '@/components/NotFound';

interface IProfessor {
  professor_id: number;
  first_name: string;
  last_name: string;
}

function getURL(page: string | null, limit: string) {
  let url: string;
  url = `/api/professors`;

  return url;
}

export default function ProfessorsPage() {
  const flexStyle = useFlexStyle();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [limit, setLimit] = useState<string>('2');
  const page = searchParams.get('page') || null;

  const professorsURL = getURL(page, limit);
  const { data: professorsResponse, error } = useSWR(professorsURL, apiFetcher);
  const [professors, setProfessors] = useState<IProfessor[]>([]);

  useEffect(() => {
    setProfessors(professorsResponse?.data.professors || []);
  }, [professorsResponse]);

  useEffect(() => {
    if (professorsResponse) {
      const professorArray = professorsResponse?.data?.professors || [];
      // Filter courses based on search query
      const filteredProfessors = searchQuery
        ? professorArray.filter(
            (professor: IProfessor) =>
              professor.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              professor.last_name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : professorArray;

      setProfessors(filteredProfessors);
    }
  }, [professorsResponse, searchQuery]);

  if (error)
    return (
      <Flex justifyContent="center" alignItems="center" h="100vh">
        <Text>Error loading professors</Text>
      </Flex>
    );
  if (!professorsResponse)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
        &nbsp;&nbsp; Loading ...
      </div>
    );

  if (professors.length === 0) {
    return (
      <Flex h="100vh" justifyContent="center" alignItems="center">
        <NotFound statusCode="No Professors Found" />
      </Flex>
    );
  }

  return (
    <>
      <Grid
        gridTemplateColumns="repeat(12, 1fr)"
        gap={{ base: '3', md: '3', lg: '6' }}
        p={{ base: '3', md: '3', lg: '5' }}
        margin="0 auto"
        w={{ base: '100%', xl: '95%' }}
        bgColor={flexStyle.bgColor}
      >
        {professors.map((professor) => (
          <GridItem
            key={professor.professor_id}
            gridColumn={{ base: 'span 12', md: 'span 6', lg: 'span 4' }}
          >
            <ProfessorCard professor={professor} />
          </GridItem>
        ))}
      </Grid>
    </>
  );
}
