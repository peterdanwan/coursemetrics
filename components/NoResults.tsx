'use client';

import { Box, Heading, Text } from '@chakra-ui/react';
import { WarningTwoIcon } from '@chakra-ui/icons';

interface NoResultsProps {
  statusCode: string | null;
  statusMessage?: string;
}

export default function NoResults({
  statusCode,
  statusMessage = 'No results found',
}: NoResultsProps) {
  return (
    <Box textAlign="center" py={10} px={6}>
      <WarningTwoIcon boxSize={'50px'} color={'orange.300'} />
      <Heading as="h2" size="xl" mt={6} mb={2}>
        {statusCode}
      </Heading>
      <Text color={'gray.500'}>{statusMessage}</Text>
    </Box>
  );
}
