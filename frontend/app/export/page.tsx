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

export default function ExportPage() {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'pdf'>('json');

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
          <p>Connect wallet to export data</p>
        </motion.div>
      </div>
    );
  }

  const formats = [
    { id: 'json', icon: '📄', name: 'JSON', desc: 'Complete data' },
    { id: 'csv', icon: '📊', name: 'CSV', desc: 'Spreadsheet data' },
    { id: 'pdf', icon: '📕', name: 'PDF', desc: 'Report format' }
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
                y: [0, -10, 0],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
              }}
            >
              📤
            </motion.div>
            <div className="page-info">
              <h1>Data Export</h1>
              <p className="page-description">
                Export your encrypted contact data for backup or analysis
              </p>
            </div>
          </div>

          <div className="header-decoration">
            <div className="floating-emoji">💾</div>
            <div className="floating-emoji delay-1">📊</div>
            <div className="floating-emoji delay-2">📈</div>
          </div>
        </motion.div>

        {/* Format Selector */}
        <motion.div 
          className="format-selector"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3>Select Export Format</h3>
          <div className="format-buttons">
            {formats.map((format) => (
              <motion.button
                key={format.id}
                className={`format-button ${exportFormat === format.id ? 'active' : ''}`}
                onClick={() => setExportFormat(format.id as 'json' | 'csv' | 'pdf')}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="format-icon">{format.icon}</span>
                <span className="format-text">{format.name}</span>
                <span className="format-desc">{format.desc}</span>
              </motion.button>
            ))}
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
            { icon: '🔒', title: 'Secure Export', desc: 'Data remains encrypted before export' },
            { icon: '💾', title: 'Local Storage', desc: 'Download directly to your device' },
            { icon: '📊', title: 'Multiple Formats', desc: 'Support JSON, CSV, PDF' }
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

        {/* Export Section */}
        <motion.div 
          className="export-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="section-header">
            <h2>📥 Export Your Data</h2>
            <p>Choose data to export and download locally</p>
          </div>

          <SecureDataDemo />
        </motion.div>

        {/* Data Insights */}
        <motion.div 
          className="insights-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="insights-card">
            <div className="insights-header">
              <span className="insights-icon">📈</span>
              <h3>Data Insights</h3>
            </div>
            <div className="insights-content">
              {[
                { icon: '🔐', title: 'Encryption Strength', value: 'FHE 256-bit' },
                { icon: '⏱️', title: 'Data Freshness', value: 'Real-time' },
                { icon: '🛡️', title: 'Privacy Level', value: 'Maximum' }
              ].map((insight, index) => (
                <motion.div 
                  key={index}
                  className="insight-item"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="insight-icon">{insight.icon}</span>
                  <div className="insight-info">
                    <div className="insight-title">{insight.title}</div>
                    <div className="insight-value">{insight.value}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Usage Tips */}
        <motion.div 
          className="usage-tips"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="tips-card">
            <div className="tips-header">
              <span className="tips-icon">💡</span>
              <h3>Usage Tips</h3>
            </div>
            <div className="tips-content">
              {[
                { icon: '💾', text: 'Regularly export data as backup' },
                { icon: '🔒', text: 'Keep exported files secure to avoid leaks' },
                { icon: '📊', text: 'JSON for technical analysis, PDF for sharing' },
                { icon: '⚡', text: 'Export process happens entirely locally' }
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
