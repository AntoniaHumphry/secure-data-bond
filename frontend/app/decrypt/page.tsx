"use client";

import dynamic from 'next/dynamic';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';

const SecureDataDemo = dynamic(() => import('@/components/SecureDataDemo').then(mod => ({ default: mod.SecureDataDemo })), {
  ssr: false,
  loading: () => <LoadingSkeleton />
});

const LoadingSkeleton = () => (
  <div className="page-skeleton">
    <div className="skeleton-header"></div>
    <div className="skeleton-cards">
      <div className="skeleton-card"></div>
      <div className="skeleton-card"></div>
    </div>
  </div>
);

export default function DecryptPage() {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [decryptionMode, setDecryptionMode] = useState<'own' | 'others'>('own');

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (!mounted) {
    return (
      <div className="page-container">
        <div className="connection-required">
          <motion.div 
            className="connection-icon"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            ⏳
          </motion.div>
          <h2>Loading...</h2>
          <p>Initializing application...</p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="page-container">
        <motion.div 
          className="connection-required"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div 
            className="connection-icon"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🔗
          </motion.div>
          <h2>Connect Wallet</h2>
          <p>Connect wallet to decrypt contact information</p>
        </motion.div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="page-container">
        {/* Page Header */}
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="page-header-content">
            <motion.div 
              className="page-icon"
              animate={{ 
                rotateY: [0, 360],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              🔓
            </motion.div>
            <div className="page-info">
              <h1>Decryption Center</h1>
              <p className="page-description">
                Safely decrypt and view encrypted contact information
              </p>
            </div>
          </div>

          <div className="header-decoration">
            <div className="floating-emoji">🔑</div>
            <div className="floating-emoji delay-1">✨</div>
            <div className="floating-emoji delay-2">🎉</div>
          </div>
        </motion.div>

        {/* Mode Selector */}
        <motion.div 
          className="mode-selector"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mode-buttons">
            <motion.button
              className={`mode-button ${decryptionMode === 'own' ? 'active' : ''}`}
              onClick={() => setDecryptionMode('own')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="mode-icon">👤</span>
              <span className="mode-text">My Data</span>
            </motion.button>
            <motion.button
              className={`mode-button ${decryptionMode === 'others' ? 'active' : ''}`}
              onClick={() => setDecryptionMode('others')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="mode-icon">🔍</span>
              <span className="mode-text">Others</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { icon: '⚡', title: 'Instant Decryption', desc: 'FHE technology for fast secure decryption' },
            { icon: '🎯', title: 'Precise Control', desc: 'Only authorized users can view information' },
            { icon: '🛡️', title: 'Privacy Protection', desc: 'Decryption process is completely secure' }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              className="feature-card"
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Decryption Section */}
        <motion.div 
          className="decryption-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="section-header">
            <h2>
              {decryptionMode === 'own' ? '🔐 Decrypt My Data' : '🔍 Decrypt Others'}
            </h2>
            <p>
              {decryptionMode === 'own'
                ? 'View your own encrypted contact information'
                : 'Enter someone else\'s wallet address to view public info'
              }
            </p>
          </div>

          <SecureDataDemo />
        </motion.div>

        {/* How it Works */}
        <motion.div 
          className="how-it-works"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="how-card">
            <div className="how-header">
              <span className="how-icon">🔄</span>
              <h3>Decryption Process</h3>
            </div>
            <div className="how-steps">
              {[
                { num: '1', title: 'Select', desc: 'Choose address to decrypt' },
                { num: '2', title: 'Compute', desc: 'FHE homomorphic decryption computation' },
                { num: '3', title: 'Reveal', desc: 'Safely display plaintext data' }
              ].map((step, index) => (
                <motion.div 
                  key={index}
                  className="step"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="step-number">{step.num}</div>
                  <div className="step-content">
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.div 
          className="security-notice"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="notice-card">
            <div className="notice-header">
              <span className="notice-icon">⚠️</span>
              <h3>Security Notice</h3>
            </div>
            <div className="notice-content">
              {[
                { icon: '🔒', text: 'Decryption happens entirely client-side, private keys never exposed' },
                { icon: '👁️', text: 'Only data owners control who can view their information' },
                { icon: '🛡️', text: 'FHE guarantees data security during decryption process' }
              ].map((notice, index) => (
                <motion.div 
                  key={index}
                  className="notice-item"
                  whileHover={{ x: 5 }}
                >
                  <span className="notice-bullet">{notice.icon}</span>
                  <span>{notice.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </ErrorBoundary>
  );
}
