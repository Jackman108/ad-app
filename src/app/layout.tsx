import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ad App',
  description: 'Объявления от частных лиц — Беларусь',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
