
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import 'katex/dist/katex.min.css';
import { AuthProvider } from '@/hooks/use-auth';
import { Header } from '@/components/header';

export const metadata: Metadata = {
  title: 'Vertical Ascent',
  description: 'An interactive learning journey to broaden your knowledge.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;700&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <Header />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
