import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PillProof - Blockchain Medicine",
  description: "Medicine supply chain verification",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header style={{
          backgroundColor: '#282c34',
          padding: '20px',
          color: 'white',
        }}>
          <h1>PillProof</h1>
          <nav style={{ display: 'flex', gap: '15px' }}>
            <a href="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</a>
            <a href="/verify" style={{ color: 'white', textDecoration: 'none' }}>Verify</a>
            <a href="/detect" style={{ color: 'white', textDecoration: 'none' }}>Detect</a>
            <a href="/qr-scanner" style={{ color: 'white', textDecoration: 'none' }}>QR Scanner</a>
            <a href="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</a>
          </nav>
        </header>
        <main style={{ padding: '20px' }}>{children}</main>
      </body>
    </html>
  );
}
