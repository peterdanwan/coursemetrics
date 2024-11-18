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
  Spinner,
} from '@chakra-ui/react';
import ProfessorCard from '@/components/ProfessorCard'; // Ensure the path is correct
import { apiFetcher } from '@/utils';
import { useFlexStyle } from '@/styles/styles';

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
  const [limit, setLimit] = useState<string>('2');
  const page = searchParams.get('page') || null;

  const professorsURL = getURL(page, limit);
  const { data: professorsResponse, error } = useSWR(professorsURL, apiFetcher);
  const [professors, setProfessors] = useState<IProfessor[]>([]);

  useEffect(() => {
    setProfessors(professorsResponse?.data.professors || []);
  }, [professorsResponse]);

  if (error) return <Text>Error loading courses</Text>;
  if (!professorsResponse)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
        &nbsp;&nbsp; Loading professors...
      </div>
    );

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
        {professors.length > 0 && (
          <GridItem
            gridColumn={{ base: 'span 12' }}
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
          ></GridItem>
        )}
        {professors.length > 0 ? (
          professors.map((professor) => (
            <GridItem
              key={professor.professor_id}
              gridColumn={{ base: 'span 12', md: 'span 6', lg: 'span 4' }}
            >
              <ProfessorCard professor={professor} />
            </GridItem>
          ))
        ) : (
          <Text>No Professors available</Text>
        )}
      </Grid>
    </>
  );
}
