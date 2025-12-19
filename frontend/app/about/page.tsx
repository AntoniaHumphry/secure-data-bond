"use client";

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'technology' | 'security'>('overview');

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

  const tabs = [
    { id: 'overview', icon: '📋', label: 'Overview' },
    { id: 'technology', icon: '🔬', label: 'Technology' },
    { id: 'security', icon: '🛡️', label: 'Security' }
  ];

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
                rotate: [0, 10, -10, 0],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
              }}
            >
              ℹ️
            </motion.div>
            <div className="page-info">
              <h1>About SecureData</h1>
              <p className="page-description">
                Learn about our Fully Homomorphic Encryption contact management system
              </p>
            </div>
          </div>

          <div className="header-decoration">
            <div className="floating-emoji">🚀</div>
            <div className="floating-emoji delay-1">🔬</div>
            <div className="floating-emoji delay-2">💡</div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          className="tab-navigation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="tab-buttons">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.icon} {tab.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              className="tab-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Mission Section */}
              <div className="mission-section">
                <motion.div 
                  className="mission-card"
                  variants={itemVariants}
                >
                  <div className="mission-icon">🎯</div>
                  <h3>Our Mission</h3>
                  <p>
                    SecureData is committed to providing users with cutting-edge privacy protection solutions through Fully Homomorphic Encryption (FHE) technology.
                    We believe everyone has the right to fully control their own data while enjoying the convenience brought by modern technology.
                  </p>
                </motion.div>
              </div>

              {/* Features Overview */}
              <motion.div 
                className="features-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {[
                  { icon: '🔐', title: 'Fully Homomorphic Encryption', desc: 'Data can be computed while encrypted' },
                  { icon: '👤', title: 'User Sovereignty', desc: 'You fully control data access permissions' },
                  { icon: '⚡', title: 'Real-time Processing', desc: 'Fast encryption and decryption operations' },
                  { icon: '🔗', title: 'Blockchain Storage', desc: 'Decentralized secure storage' }
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

              {/* Stats */}
              <motion.div 
                className="stats-cards"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {[
                  { value: '100%', label: 'Privacy' },
                  { value: 'FHE', label: 'Encryption' },
                  { value: '24/7', label: 'Availability' }
                ].map((stat, index) => (
                  <motion.div 
                    key={index}
                    className="stat-card"
                    variants={itemVariants}
                  >
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'technology' && (
            <motion.div 
              key="technology"
              className="tab-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Tech Stack */}
              <div className="section-header">
                <h2>🔬 Technology Stack</h2>
                <p>Core technologies powering SecureData</p>
              </div>

              <motion.div 
                className="tech-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {[
                  { icon: '🌐', title: 'Frontend', items: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Wagmi'] },
                  { icon: '⚡', title: 'FHE Tech', items: ['Zama FHEVM', 'tfhe-rs', 'Zero Knowledge', 'Smart Contracts'] },
                  { icon: '⛓️', title: 'Blockchain', items: ['Ethereum', 'Solidity', 'Decentralized', 'Gas Optimized'] }
                ].map((tech, index) => (
                  <motion.div 
                    key={index}
                    className="tech-item"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="tech-icon">{tech.icon}</div>
                    <h4>{tech.title}</h4>
                    <p>{tech.items.join(' • ')}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* How FHE Works */}
              <div className="how-it-works">
                <div className="how-card">
                  <div className="how-header">
                    <span className="how-icon">🧠</span>
                    <h3>How FHE Works</h3>
                  </div>
                  <div className="how-steps">
                    {[
                      { num: '1', title: 'Encrypt', desc: 'Encrypt data using FHE algorithms' },
                      { num: '2', title: 'Compute', desc: 'Perform computations on encrypted data' },
                      { num: '3', title: 'Decrypt', desc: 'Decrypt results to plaintext' }
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
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div 
              key="security"
              className="tab-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Security Features */}
              <div className="section-header">
                <h2>🛡️ Security Features</h2>
                <p>Core features protecting your data security</p>
              </div>

              <motion.div 
                className="features-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {[
                  { icon: '🔐', title: 'End-to-end Encryption', desc: 'Servers never see plaintext' },
                  { icon: '🗝️', title: 'User Control', desc: 'Only you can authorize access' },
                  { icon: '🔍', title: 'Transparent Audit', desc: 'All operations are auditable' },
                  { icon: '🚫', title: 'Zero Trust Architecture', desc: 'No reliance on centralized trust' }
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

              {/* Best Practices */}
              <div className="tips-section">
                <div className="tips-card">
                  <div className="tips-header">
                    <span className="tips-icon">📚</span>
                    <h3>Security Best Practices</h3>
                  </div>
                  <div className="tips-content">
                    {[
                      { icon: '🔑', text: 'Safely store your wallet private keys' },
                      { icon: '📱', text: 'Regularly backup your encrypted data' },
                      { icon: '🔍', text: 'Verify smart contract addresses' },
                      { icon: '🛡️', text: 'Use strong passwords and 2FA' }
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call to Action */}
        <motion.div 
          className="getting-started"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="getting-started-card">
            <div className="getting-started-header">
              <span className="getting-started-icon">🚀</span>
              <h2>Ready to Start?</h2>
            </div>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Experience the power of Fully Homomorphic Encryption now
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <Link href="/submit" className="neon-button">
                📝 Get Started
              </Link>
              <Link href="/contacts" className="neon-button secondary">
                👥 View Contacts
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </ErrorBoundary>
  );
}
