import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PillProof - Medicine Supply Chain',
  description: 'Blockchain-based medicine supply chain verification',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
