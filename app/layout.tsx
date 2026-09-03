import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'XDR-Lens | Soroban Pre-Execution Diagnostic Studio',
  description:
    'Interactive Stellar XDR transaction envelope visualizer, Soroban footprint analyzer, pre-broadcast RPC simulator, and authorization entry tree decoder.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-stellar-dark text-white antialiased">
        {children}
      </body>
    </html>
  );
}
