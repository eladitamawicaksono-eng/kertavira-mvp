import './globals.css';
import RegisterSW from '../components/RegisterSW';

export const metadata = {
  title: 'Kertavira',
  description: 'Catat kas harian usahamu, tanpa ribet.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
};

export const viewport = {
  themeColor: '#4338CA',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}
