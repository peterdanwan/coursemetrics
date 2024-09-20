// app/layout.tsx
import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import MainNav from '@/components/Navbar/MainNav';
import Footer from '@/components/Footer/MainFooter';
import { Container } from '@chakra-ui/react';
import { getSession } from '@auth0/nextjs-auth0';

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get the user information from Auth0 and set it to global state so that we can access it from anywhere
  const { user }: any = await getSession();

  return (
    <html lang="en">
      <UserProvider>
        <body className="bg-ourBG text-white min-h-screen">
          <Providers>
            <MainNav user={user} />
            <Container maxW="container.4xl" minHeight={'90vh'}>
              {children}
            </Container>
          </Providers>
        </body>
      </UserProvider>
    </html>
  );
}
