import './globals.css';
import Providers from './provider';
import { Red_Hat_Display } from 'next/font/google';

const redHatDisplay = Red_Hat_Display({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-red-hat-display',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={redHatDisplay.variable}>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/your-kit-id.css" />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
