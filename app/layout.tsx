import './globals.css';
// import '@/components/logo/logoAnimation.js'

import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { cn } from '@/lib/utils';

const font = Cairo({
  subsets: ['arabic'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Msrnow.com',
  description: 'Msrnow.com Top News of the day'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" suppressHydrationWarning>
      {/* <body className={cn(font.className, 'bg-white dark:bg-[#302E2B]')}> */}
      {/* <body className={cn(font.className, 'bg-white dark:bg-[#000]')}> */}
      <body className={`${font.className} bg-white dark:bg-[#000]`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem storageKey="msrnow-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
