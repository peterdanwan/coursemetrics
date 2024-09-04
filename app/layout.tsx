// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import MainNav from '@/components/Navbar/MainNav';
import { Container } from '@chakra-ui/react';

export const metadata: Metadata = {
  title: 'CourseMetrics',
  description: 'PRJ666 Final Project',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <UserProvider>
        {/* <body className="bg-[#0B2027] text-white min-h-screen">
          <Providers>
            <NavBar />
            {children}
          </Providers>
        </body> */}
        <body>
          <Providers>
            <MainNav />
            <Container maxW='container.4xl' minHeight={'90vh'}>
              {children}
            </Container>
          </Providers>
        </body>
      </UserProvider>
    </html>
  );
}
