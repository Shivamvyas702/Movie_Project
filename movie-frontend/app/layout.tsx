import { Toaster } from 'react-hot-toast';
import './globals.css';
import AuthHydrator from '@/app/components/AuthHydrator';

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body>
        <AuthHydrator />
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
