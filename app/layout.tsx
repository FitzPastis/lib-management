import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { SessionProvider } from 'next-auth/react';

import './globals.css';

import { Toaster } from '@/components/ui/sonner';
import { auth } from '@/auth';

const ibmPlexSans = localFont({
  src: [
    { path: '/fonts/IBMPlexSans-Regular.ttf', weight: '400', style: 'normal' },
    { path: '/fonts/IBMPlexSans-Medium.ttf', weight: '500', style: 'normal' },
    { path: '/fonts/IBMPlexSans-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '/fonts/IBMPlexSans-Bold.ttf', weight: '700', style: 'normal' },
  ],
});

const bebasNeue = localFont({
  src: [{ path: '/fonts/BebasNeue-Regular.ttf', weight: '400', style: 'normal' }],
  variable: '--bebas-neue',
});

export const metadata: Metadata = {
  title: 'StoriesUnwise',
  description: 'Cette biblio est une gestion des livres',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang='en'>
      <SessionProvider session={session}>
        <body className={`${ibmPlexSans.className} ${bebasNeue.variable} antialiased`}>
          {children}
          <Toaster richColors />
        </body>
      </SessionProvider>
    </html>
  );
}
