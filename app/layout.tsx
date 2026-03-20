import type { Metadata } from 'next';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'The Kinetic Atelier | Fidget Collection',
  description: 'A curated catalog for luxury fidget toy collectors',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        variables: {
          colorBackground: '#20201F',
          colorPrimary: '#E9C349',
          colorText: '#E5E2E1',
          colorTextSecondary: '#C4C7C7',
          colorInputBackground: '#1C1B1B',
          colorInputText: '#E5E2E1',
          colorNeutral: '#353535',
        },
      }}
    >
      <html lang="en">
        <body className="font-body antialiased">
          <Sidebar />
          <main className="md:ml-64 min-h-screen flex flex-col">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
