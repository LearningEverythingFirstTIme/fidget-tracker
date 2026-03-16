import type { Metadata } from 'next';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'FIDGET://TRACKER',
  description: 'Terminal-grade collection management for fidget enthusiasts',
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
          colorBackground: '#18181c',
          colorPrimary: '#00e5cc',
          colorText: '#e4e4e7',
          colorTextSecondary: '#71717a',
          colorInputBackground: '#1a1a1f',
          colorInputText: '#e4e4e7',
          colorNeutral: '#27272a',
        },
      }}
    >
      <html lang="en" className="dark">
        <body className="font-mono antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
