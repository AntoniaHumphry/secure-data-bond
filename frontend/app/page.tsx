"use client";

import Link from 'next/link';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ASCII_ART = `
███████╗███████╗ ██████╗██╗   ██╗██████╗ ███████╗
██╔════╝██╔════╝██╔════╝██║   ██║██╔══██╗██╔════╝
███████╗█████╗  ██║     ██║   ██║██████╔╝█████╗  
╚════██║██╔══╝  ██║     ██║   ██║██╔══██╗██╔══╝  
███████║███████╗╚██████╗╚██████╔╝██║  ██║███████╗
╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝
        ██████╗  █████╗ ████████╗ █████╗         
        ██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗        
        ██║  ██║███████║   ██║   ███████║        
        ██║  ██║██╔══██║   ██║   ██╔══██║        
        ██████╔╝██║  ██║   ██║   ██║  ██║        
        ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝        
`;

export default function DashboardPage() {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const quickActions = [
    {
      title: 'Submit Info',
      description: 'Encrypt and store contacts',
      icon: '📝',
      href: '/submit',
      gradient: 'linear-gradient(135deg, #00F5D4 0%, #00BBF9 100%)'
    },
    {
      title: 'View Contacts',
      description: 'Browse encrypted data',
      icon: '👥',
      href: '/contacts',
      gradient: 'linear-gradient(135deg, #9B5DE5 0%, #F15BB5 100%)'
    },
    {
      title: 'Decrypt Data',
      description: 'FHE secure decryption',
      icon: '🔓',
      href: '/decrypt',
      gradient: 'linear-gradient(135deg, #FEE440 0%, #F15BB5 100%)'
    },
    {
      title: 'Export Data',
      description: 'Backup your information',
      icon: '📤',
      href: '/export',
      gradient: 'linear-gradient(135deg, #00BBF9 0%, #9B5DE5 100%)'
    }
  ];

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

  return (
    <ErrorBoundary>
      <div className="page-container">
        {/* Hero Section */}
        <motion.div 
          className="dashboard-hero"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <pre className="hero-ascii">{ASCII_ART}</pre>
          
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Your Contacts. Fully Encrypted. Always.
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Protect your contact information using Fully Homomorphic Encryption (FHE) technology.
            Data is stored and computed in encrypted state, providing true end-to-end privacy protection.
          </motion.p>

          {mounted && !isConnected && (
            <motion.div 
              className="hero-notice"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="notice-icon">💡</span>
              Please connect your wallet to access full functionality
            </motion.div>
          )}
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="stats-section"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="stats-cards">
            <motion.div className="stat-card" variants={itemVariants}>
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <div className="stat-value">1</div>
                <div className="stat-label">Total Contacts</div>
              </div>
            </motion.div>
            
            <motion.div className="stat-card" variants={itemVariants}>
              <div className="stat-icon">🔐</div>
              <div className="stat-info">
                <div className="stat-value">1</div>
                <div className="stat-label">Encrypted</div>
              </div>
            </motion.div>
            
            <motion.div className="stat-card" variants={itemVariants}>
              <div className="stat-icon">⚡</div>
              <div className="stat-info">
                <div className="stat-value">3</div>
                <div className="stat-label">Actions Today</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="quick-actions-section"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="section-header">
            <h2>⚡ Quick Actions</h2>
            <p>Quick access to common features</p>
          </div>
          
          <div className="quick-actions-grid">
            {quickActions.map((action) => (
              <motion.div key={action.href} variants={itemVariants}>
                <Link href={action.href} className="quick-action-card">
                  <div 
                    className="action-gradient"
                    style={{ background: action.gradient }}
                  >
                    <div className="action-icon">{action.icon}</div>
                  </div>
                  <div className="action-content">
                    <h3>{action.title}</h3>
                    <p>{action.description}</p>
                    <div className="action-arrow">→</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Showcase */}
        <motion.div 
          className="features-showcase"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="section-header">
            <h2>✨ Core Features</h2>
            <p>Explore SecureData&apos;s powerful features</p>
          </div>
          
          <div className="features-grid">
            {[
              { icon: '🔐', title: 'FHE Encryption', desc: 'Fully homomorphic encryption, data always secure' },
              { icon: '👤', title: 'User Sovereignty', desc: 'You fully control data access permissions' },
              { icon: '⚡', title: 'Real-time Processing', desc: 'Fast encryption/decryption operations' },
              { icon: '🔗', title: 'On-chain Storage', desc: 'Decentralized secure storage' }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="feature-showcase"
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="feature-emoji">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Activity Timeline */}
        <motion.div 
          className="activity-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="section-header">
            <h2>📋 Recent Activity</h2>
            <p>Your recent activity log</p>
          </div>
          
          <div className="activity-timeline">
            {[
              { icon: '📝', title: 'Submit contact info', time: 'Just now' },
              { icon: '🔐', title: 'Data encryption completed', time: '5 minutes ago' },
              { icon: '🔓', title: 'Decrypt contact info', time: '10 minutes ago' }
            ].map((activity, index) => (
              <motion.div 
                key={index}
                className="activity-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-content">
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Getting Started */}
        {mounted && !isConnected && (
          <motion.div 
            className="getting-started"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="getting-started-card">
              <div className="getting-started-header">
                <span className="getting-started-icon">🚀</span>
                <h2>Getting Started</h2>
              </div>
              
              <div className="getting-started-steps">
                {[
                  { num: '1', title: 'Connect Wallet', desc: 'Click top right to connect Ethereum wallet' },
                  { num: '2', title: 'Submit Info', desc: 'Add contacts, automatic FHE encryption' },
                  { num: '3', title: 'Secure Storage', desc: 'Data securely stored on blockchain' },
                ].map((step, index) => (
                  <div key={index} className="step">
                    <div className="step-number">{step.num}</div>
                    <div className="step-content">
                      <h4>{step.title}</h4>
                      <p>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </ErrorBoundary>
  );
}
