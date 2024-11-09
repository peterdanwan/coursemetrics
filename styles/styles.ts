// styles/styles.ts
'use client';
import { useColorModeValue } from '@chakra-ui/react';

export const useFlexStyle = () => {
  return {
    bgColor: useColorModeValue('gray.50', 'gray.800'),
    color: useColorModeValue('gray.600', 'white'),
    borderColor: useColorModeValue('gray.200', 'gray.900'),
    hoverBg: useColorModeValue('gray.200', 'gray.700'),
    cardBg: useColorModeValue('white', 'gray.700'),
    cardColor: useColorModeValue('gray.600', 'white'),
    cardHoverBg: useColorModeValue('gray.100', 'gray.600'),
    headingColor: useColorModeValue('teal.500', 'teal.200'),
    policyBgColor: useColorModeValue('gray.200', 'gray.600'),
  };
};
