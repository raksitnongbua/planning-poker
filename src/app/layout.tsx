import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CookiesProvider } from 'next-client-cookies/server';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Planning Poker Online',
  description: 'Make Estimating Agile Projects Accurate & Fun',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CookiesProvider>
      <html lang='en'>
        <body className={inter.className}>{children}</body>
      </html>
    </CookiesProvider>
  );
}
