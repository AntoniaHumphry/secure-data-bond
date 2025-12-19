"use client";

import dynamic from 'next/dynamic';
import { ErrorBoundary } from '@/components/ErrorBoundary';
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

export default function SubmitPage() {
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
        {/* Page Header */}
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="page-header-content">
            <motion.div 
              className="page-icon"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              📝
            </motion.div>
            <div className="page-info">
              <h1>Encrypt & Submit</h1>
              <p className="page-description">
                Use FHE to encrypt your contact information and securely store it on the blockchain
              </p>
            </div>
          </div>

          <div className="header-decoration">
            <div className="floating-emoji">✨</div>
            <div className="floating-emoji delay-1">🔒</div>
            <div className="floating-emoji delay-2">🛡️</div>
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
            { icon: '🔐', title: 'End-to-end Encryption', desc: 'Data is encrypted before submission' },
            { icon: '🚀', title: 'Instant Submission', desc: 'Fast and secure blockchain storage' },
            { icon: '👀', title: 'Privacy Protection', desc: 'Only you control access permissions' }
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

        {/* Main Form Section */}
        <motion.div 
          className="form-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SecureDataDemo />
        </motion.div>

        {/* How FHE Works */}
        <motion.div 
          className="how-it-works"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="how-card">
            <div className="how-header">
              <span className="how-icon">🔄</span>
              <h3>How FHE Encryption Works</h3>
            </div>
            <div className="how-steps">
              {[
                { num: '1', title: 'Input', desc: 'Enter your contact information' },
                { num: '2', title: 'Encrypt', desc: 'FHE client-side encryption' },
                { num: '3', title: 'Submit', desc: 'Ciphertext stored on-chain' }
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

        {/* Tips Section */}
        <motion.div 
          className="tips-section"
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
                { icon: '📱', text: 'Phone number should be 2 digits (e.g.: 12, 34, 56)' },
                { icon: '📧', text: 'Email address must contain @ symbol' },
                { icon: '🚨', text: 'Emergency contact is also 2-digit format' },
                { icon: '⚡', text: 'Ensure FHE system is initialized before submission' }
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
