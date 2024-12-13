import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/auth.context';
import { ToasterProvider } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Nextmit Admin - Festival Eat & Drink',
  description: 'Tableau de bord administratif pour le festival Eat & Drink',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ToasterProvider>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
              {children}
            </div>
          </ToasterProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
