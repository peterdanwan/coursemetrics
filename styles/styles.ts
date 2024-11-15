// styles/styles.ts
'use client';
import { useColorModeValue } from '@chakra-ui/react';

export const useFlexStyle = () => {
  return {
    // Main body colors
    bgColor: useColorModeValue('white', 'gray.800'),
    color: useColorModeValue('gray.600', 'white'),
    borderColor: useColorModeValue('gray.200', 'gray.900'),
    hoverBg: useColorModeValue('gray.200', 'gray.700'),
    cardBg: useColorModeValue('gray.50', 'gray.700'),
    cardColor: useColorModeValue('gray.600', 'white'),
    cardHoverBg: useColorModeValue('gray.100', 'gray.600'),
    headingColor: useColorModeValue('teal.500', 'teal.200'),
    policyBgColor: useColorModeValue('gray.200', 'gray.600'),
    dividerColor: useColorModeValue('gray.900', 'gray.200'),
    requiredColor: useColorModeValue('teal.500', 'teal.200'),
    accordionPanelColor: useColorModeValue('gray.800', 'gray.200'),
  };
};
