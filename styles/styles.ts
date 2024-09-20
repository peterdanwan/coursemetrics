// styles/styles.ts
import { useColorModeValue } from '@chakra-ui/react';

export const useFlexStyle = () => {
  return {
    bgColor: useColorModeValue('white', 'gray.800'),
    color: useColorModeValue('gray.600', 'white'),
    borderColor: useColorModeValue('gray.200', 'gray.900'),
  };
};
