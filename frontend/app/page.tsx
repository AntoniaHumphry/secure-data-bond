"use client";

import dynamic from 'next/dynamic';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const SecureDataDemo = dynamic(() => import('@/components/SecureDataDemo').then(mod => ({ default: mod.SecureDataDemo })), {
  ssr: false,
  loading: () => <div className="loading">Loading SecureData...</div>
});

export default function Home() {
  return (
    <ErrorBoundary>
      {/* Hero Section */}
      <div className="hero-section">
        <h2>Secure Your Contact Information</h2>
        <p>Store your personal contact details with military-grade encryption using Fully Homomorphic Encryption</p>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        <SecureDataDemo />
      </div>
    </ErrorBoundary>
  );
}
