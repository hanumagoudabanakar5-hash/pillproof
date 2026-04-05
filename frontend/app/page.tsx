import Link from 'next/link';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to Pillproof</h1>
      <nav>
        <ul>
          <li><Link href="/register">Register</Link></li>
          <li><Link href="/verify">Verify</Link></li>
          <li><Link href="/detect">Detect</Link></li>
          <li><Link href="/qr-scanner">QR Scanner</Link></li>
          <li><Link href="/dashboard">Dashboard</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default HomePage;