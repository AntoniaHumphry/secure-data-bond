import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: "SecureData - FHE Encrypted Contact Management",
  description: "Store and manage your personal contact information with Fully Homomorphic Encryption privacy",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <div className="secure-data-app">
            <Navigation />
            <div className="wallet-connect-section">
              <div className="wallet-container">
                <ConnectButton />
              </div>
            </div>
            <main className="main-content">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}











