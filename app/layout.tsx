import type { Metadata } from 'next';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'FIDGET COLLECTOR',
  description: 'A curated catalog for fidget toy enthusiasts',
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
          colorBackground: '#FFFFFF',
          colorPrimary: '#e63746',
          colorText: '#1A1918',
          colorTextSecondary: '#8A8782',
          colorInputBackground: '#FFFFFF',
          colorInputText: '#1A1918',
          colorNeutral: '#EBE6DA',
        },
      }}
    >
      <html lang="en">
        <body className="font-sans antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
