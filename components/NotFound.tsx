'use client';

import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

export default function NotFound({ statusCode }: { statusCode: string }) {
  return (
    <Box textAlign="center" py={10} px={6} my={'auto'}>
      <Box display="inline-block" my={'auto'}>
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          bg={'red.500'}
          rounded={'50px'}
          w={'55px'}
          h={'55px'}
          textAlign="center"
        >
          <CloseIcon boxSize={'20px'} color={'white'} />
        </Flex>
      </Box>
      <Heading as="h2" size="xl" mt={6} mb={2}>
        {statusCode}
      </Heading>
    </Box>
  );
}
