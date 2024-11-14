// app/providers.tsx
'use client';

import { ChakraProvider } from '@chakra-ui/react';

import { NextUIProvider } from '@nextui-org/react';
import theme from '@/styles/theme';

export function Providers({ children }: { children: React.ReactNode }) {
  // return <NextUIProvider>{children}</NextUIProvider>;
  return (
    <NextUIProvider>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </NextUIProvider>
  );
}
