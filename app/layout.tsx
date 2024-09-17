// app/layout.tsx
import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import MainNav from '@/components/Navbar/MainNav';
import { Container } from '@chakra-ui/react';
import Loading from './loading';

export const metadata: Metadata = {
  title: 'CourseMetrics',
  description: 'PRJ666 Final Project',
  authors: [
    { name: 'Jeremy Lee' },
    { name: 'Peter Wan' },
    { name: 'Tomas Rochwerger' },
    { name: 'Mimi Dang' },
    { name: 'Vinh Nhan' },
    { name: 'Aryan Khurana' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <UserProvider>
        <Suspense fallback={<Loading />}>
          <body className="bg-ourBG text-white min-h-screen">
            <Providers>
              <MainNav />
              <Container maxW="container.4xl" minHeight={'90vh'}>
                {children}
              </Container>
            </Providers>
          </body>
        </Suspense>
      </UserProvider>
    </html>
  );
}
