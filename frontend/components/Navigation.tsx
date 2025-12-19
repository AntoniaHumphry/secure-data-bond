"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: '🏠', label: 'Home' },
    { href: '/submit', icon: '📝', label: 'Submit' },
    { href: '/contacts', icon: '👥', label: 'Contacts' },
    { href: '/decrypt', icon: '🔓', label: 'Decrypt' },
    { href: '/export', icon: '📤', label: 'Export' },
    { href: '/about', icon: 'ℹ️', label: 'About' },
  ];

  return (
    <nav className="main-navigation">
      <div className="nav-container">
        {/* Brand */}
        <Link href="/" className="nav-brand">
          <motion.div 
            className="brand-logo"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <span>🔐</span>
            <span className="brand-text">SECURE·DATA</span>
          </motion.div>
          <div className="brand-tagline">FHE PRIVACY PROTOCOL</div>
        </Link>

        {/* Navigation Links */}
        <div className="nav-menu">
          <div className="nav-links">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${pathname === item.href ? 'active' : ''}`}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
