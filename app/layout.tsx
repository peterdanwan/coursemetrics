// app\layout.tsx
import type { Metadata } from "next";
import NavBar from "@/components/Navbar/Navbar";
import "./globals.css";
import { Providers } from "./providers";
import { UserProvider } from "@auth0/nextjs-auth0/client";

export const metadata: Metadata = {
  title: "CourseMetrics",
  description: "PRJ666 Final Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <UserProvider>
        <body>
          <Providers>
            <NavBar />
            {children}
          </Providers>
        </body>
      </UserProvider>
    </html>
  );
}
