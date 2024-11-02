// styles/styles.ts
import { useColorModeValue } from '@chakra-ui/react';

export const useFlexStyle = () => {
  return {
    bgColor: useColorModeValue('gray.50', 'gray.800'),
    color: useColorModeValue('gray.600', 'white'),
    borderColor: useColorModeValue('gray.200', 'gray.900'),
    hoverBg: useColorModeValue('gray.200', 'gray.700'),
  };
};
