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

export default function ContactsPage() {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [contactStats] = useState({
    totalContacts: 1,
    encryptedContacts: 1,
    decryptedContacts: 0
  });

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
          <p>Connect wallet to view contact information</p>
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
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
              }}
            >
              👥
            </motion.div>
            <div className="page-info">
              <h1>Contact Manager</h1>
              <p className="page-description">
                View and manage your encrypted contact information
              </p>
            </div>
          </div>

          <div className="header-decoration">
            <div className="floating-emoji">👤</div>
            <div className="floating-emoji delay-1">📱</div>
            <div className="floating-emoji delay-2">📧</div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="stats-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="stat-card" variants={itemVariants}>
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-number">{contactStats.totalContacts}</div>
              <div className="stat-label">Total Contacts</div>
            </div>
          </motion.div>

          <motion.div className="stat-card encrypted" variants={itemVariants}>
            <div className="stat-icon">🔐</div>
            <div className="stat-content">
              <div className="stat-number">{contactStats.encryptedContacts}</div>
              <div className="stat-label">Encrypted</div>
            </div>
          </motion.div>

          <motion.div className="stat-card decrypted" variants={itemVariants}>
            <div className="stat-icon">🔓</div>
            <div className="stat-content">
              <div className="stat-number">{contactStats.decryptedContacts}</div>
              <div className="stat-label">Decrypted</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { icon: '👁️', title: 'Privacy View', desc: 'Safely view encrypted contact info' },
            { icon: '🔍', title: 'Smart Search', desc: 'Quickly find contacts' },
            { icon: '📈', title: 'Data Statistics', desc: 'View data statistics' }
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

        {/* Main Content Section */}
        <motion.div 
          className="contacts-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="section-header">
            <h2>📋 My Contacts</h2>
            <p>Overview of your encrypted contact information</p>
          </div>

          <SecureDataDemo />
        </motion.div>

        {/* Security Tips */}
        <motion.div 
          className="security-tips"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="tips-card">
            <div className="tips-header">
              <span className="tips-icon">🛡️</span>
              <h3>Security Tips</h3>
            </div>
            <div className="tips-content">
              {[
                { icon: '🔐', text: 'All contact info is protected by FHE encryption' },
                { icon: '👀', text: 'Only you control who can view your information' },
                { icon: '⚡', text: 'Data is securely stored on the blockchain' }
              ].map((tip, index) => (
                <motion.div 
                  key={index}
                  className="tip-item"
                  whileHover={{ x: 5 }}
                >
                  <span className="tip-bullet">{tip.icon}</span>
                  <span>{tip.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </ErrorBoundary>
  );
}
