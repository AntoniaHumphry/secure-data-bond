import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ConnectButton } from '@rainbow-me/rainbowkit';

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
            <header className="app-header">
              <div className="header-content">
                <div className="logo-section">
                  <div className="logo">🔐</div>
                  <h1>SecureData</h1>
                  <span className="tagline">FHE Contact Management</span>
                </div>
                <ConnectButton />
              </div>
            </header>
            <main className="main-content">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
