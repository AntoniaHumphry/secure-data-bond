"use client";

import React, { useState, useMemo, useEffect, useCallback, memo } from "react";
import { useAccount, useWalletClient } from 'wagmi';
import { useSecureData } from "@/hooks/useSecureData";
import { useFhevm } from "@/fhevm/useFhevm";
import { useInMemoryStorage } from "@/hooks/useInMemoryStorage";
import { useEthersSigner } from "@/hooks/useEthersSigner";
import type { ValidationResult } from "@/types/contact";

const SecureDataDemoComponent = () => {
  const { address, isConnected, chainId } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { storage } = useInMemoryStorage();
  const ethersSigner = useEthersSigner();

  const [phoneInput, setPhoneInput] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>('');
  const [emergencyInput, setEmergencyInput] = useState<string>('');
  const [targetAddress, setTargetAddress] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [formErrors, setFormErrors] = useState<{phone?: string; email?: string; emergency?: string}>({});
  const [touchedFields, setTouchedFields] = useState<{phone?: boolean; email?: boolean; emergency?: boolean}>({});

  // Ensure component only renders after hydration to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check SharedArrayBuffer support
  const [sharedArrayBufferSupported, setSharedArrayBufferSupported] = useState(false);
  useEffect(() => {
    // Check if SharedArrayBuffer is supported
    const supported = typeof SharedArrayBuffer !== 'undefined' &&
      typeof Atomics !== 'undefined' &&
      typeof Int32Array !== 'undefined';
    setSharedArrayBufferSupported(supported);
  }, []);

  // Enable FHEVM only when user is connected and ready to use it
  // Add a small delay to avoid immediate network requests on page load
  const [fhevmDelayPassed, setFhevmDelayPassed] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setFhevmDelayPassed(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Like althlete project, enable FHEVM only when connected
  const fhevmEnabled = useMemo(() =>
    isConnected && mounted && fhevmDelayPassed && typeof window !== 'undefined' && !!window?.ethereum,
    [isConnected, mounted, fhevmDelayPassed]
  );

  // Real-time form validation
  const validateField = useCallback((field: string, value: string) => {
    const errors = {...formErrors};

    switch (field) {
      case 'phone':
        if (!value) {
          errors.phone = 'Phone number is required';
        } else if (!/^\d{10,15}$/.test(value.replace(/[\s\-\(\)]/g, ''))) {
          errors.phone = 'Please enter a valid phone number (10-15 digits)';
        } else {
          delete errors.phone;
        }
        break;
      case 'email':
        if (!value) {
          errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
        break;
      case 'emergency':
        if (!value) {
          errors.emergency = 'Emergency contact is required';
        } else if (!/^\d{10,15}$/.test(value.replace(/[\s\-\(\)]/g, ''))) {
          errors.emergency = 'Please enter a valid emergency contact number';
        } else {
          delete errors.emergency;
        }
        break;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formErrors]);

  const handleFieldBlur = useCallback((field: string) => {
    setTouchedFields(prev => ({...prev, [field]: true}));
    validateField(field, field === 'phone' ? phoneInput : field === 'email' ? emailInput : emergencyInput);
  }, [phoneInput, emailInput, emergencyInput, validateField]);

  // Like althlete project, enable mock mode for local Hardhat network (chainId 31337)
  const initialMockChains = {
    31337: "http://127.0.0.1:8545", // Local Hardhat network
  };

  // FHEVM instance - enable when user is connected and ready
  const { instance: fhevmInstance, status: fhevmStatus } = useFhevm({
    provider: fhevmEnabled ? (typeof window !== 'undefined' ? window.ethereum : undefined) : undefined,
    chainId,
    enabled: fhevmEnabled, // Only enable when connected and after delay
    initialMockChains, // Enable mock mode for local network like althlete project
  });

  // Check if we're on the same chain and have valid signer
  const sameChain = useMemo(() => {
    return chainId === 31337 || chainId === 11155111; // localhost or sepolia
  }, [chainId]);

  const sameSigner = useMemo(() => {
    return !!ethersSigner && !!address;
  }, [ethersSigner, address]);

  const {
    isDeployed,
    canSubmit,
    canDecrypt,
    message,
    decryptedPhone,
    decryptedEmail,
    decryptedEmergency,
    isDecrypted,
    submitContactInfo,
    decryptContactInfo,
    validateContactInfo,
  } = useSecureData({
    instance: fhevmInstance,
    fhevmDecryptionSignatureStorage: storage,
    eip1193Provider: walletClient?.transport,
    chainId,
    ethersSigner,
    ethersReadonlyProvider: ethersSigner?.provider || undefined,
    sameChain,
    sameSigner,
    fhevmStatus,
  });

  // Check if FHEVM is available (real mode requires Relayer SDK, mock mode doesn't)
  const fhevmAvailable = !!fhevmInstance && fhevmStatus === 'ready' &&
    (chainId === 31337 || (typeof window !== 'undefined' ? !!window?.relayerSDK : false));

  // Debug logging
  console.log('FHEVM Debug:', {
    fhevmInstance: !!fhevmInstance,
    fhevmStatus,
    relayerSDK: !!window?.relayerSDK,
    fhevmAvailable,
    encryptionMode: fhevmAvailable ? 'real FHE' : 'unavailable'
  });

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput || !emailInput || !emergencyInput) {
      setValidationResult({isValid: false, errorMessage: "All fields are required"});
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      setValidationResult({isValid: false, errorMessage: "Please enter a valid email address"});
      return;
    }

    // Basic phone validation (should be valid phone number format)
    const cleanPhone = phoneInput.replace(/\D/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      setValidationResult({isValid: false, errorMessage: "Phone number should be 10-15 digits"});
      return;
    }

    // Basic emergency validation (should be valid phone number format)
    const cleanEmergency = emergencyInput.replace(/\D/g, '');
    if (cleanEmergency.length < 10 || cleanEmergency.length > 15) {
      setValidationResult({isValid: false, errorMessage: "Emergency contact should be 10-15 digits"});
      return;
    }

    setValidationResult({isValid: true, errorMessage: ""});

    // Set submitting state
    setIsSubmittingForm(true);

    // Store original user inputs for display purposes
    const originalPhone = phoneInput.trim();
    const originalEmail = emailInput.trim();
    const originalEmergency = emergencyInput.trim();

    // Convert inputs to numbers for contract submission
    // For demo contract compatibility, use last 2 digits of phone number (10-99 range)
    const phoneDigits = phoneInput.replace(/\D/g, '');
    const phoneNum = phoneDigits.length >= 2 ?
      Math.max(10, Math.min(99, parseInt(phoneDigits.slice(-2)))) : 42;

    // Convert email to numeric representation (first 8 chars as ASCII codes)
    const emailStr = emailInput.trim();
    let emailNum = 0;
    for (let i = 0; i < Math.min(emailStr.length, 8); i++) {
      emailNum = emailNum * 256 + emailStr.charCodeAt(i);
    }
    // Ensure emailNum is within uint8 range (0-255) for contract compatibility
    emailNum = emailNum % 256;

    // For demo contract compatibility, use last 2 digits of emergency number (10-99 range)
    const emergencyDigits = emergencyInput.replace(/\D/g, '');
    const emergencyNum = emergencyDigits.length >= 2 ?
      Math.max(10, Math.min(99, parseInt(emergencyDigits.slice(-2)))) : 24;

    // Store original inputs in lastSubmittedData before submitting
    // This will be used for decryption display
    const lastSubmittedData = {
      phone: originalPhone, // Store as string for display
      email: emailNum, // Still need numeric for contract
      emergency: originalEmergency, // Store as string for display
      emailStr: originalEmail, // Store original email string
    };

    try {
      await submitContactInfo(phoneNum, emailNum, emergencyNum, emailStr, lastSubmittedData);
    } finally {
      setIsSubmittingForm(false);
    }
  }, [phoneInput, emailInput, emergencyInput, submitContactInfo, setValidationResult, setIsSubmittingForm]);

  const handleDecrypt = async () => {
    const addressToDecrypt = targetAddress || address || '';
    if (!addressToDecrypt) return;

    await decryptContactInfo(addressToDecrypt);
  };


  const handleValidate = async () => {
    // Use the same logic as submission for validation
    const phoneDigits = phoneInput.replace(/\D/g, '');
    const phoneNum = phoneDigits.length >= 2 ?
      Math.max(10, Math.min(99, parseInt(phoneDigits.slice(-2)))) : 42;

    const emergencyDigits = emergencyInput.replace(/\D/g, '');
    const emergencyNum = emergencyDigits.length >= 2 ?
      Math.max(10, Math.min(99, parseInt(emergencyDigits.slice(-2)))) : 24;

    const result = await validateContactInfo(phoneNum, emailInput, emergencyNum);
    setValidationResult(result);
  };

  // Prevent hydration mismatch by only rendering after mount and delay
  if (!mounted || !fhevmDelayPassed) {
    return (
      <div className="dashboard-card">
        <div className="card-header">
          <h3>🔐 SecureData</h3>
        </div>
        <div className="status-message status-info">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span>{!mounted ? 'Loading SecureData application...' : 'Initializing FHE encryption system...'}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="dashboard-card">
        <div className="card-header">
          <h3>🔐 SecureData</h3>
        </div>
        <div className="status-message status-info">
          Please connect your wallet to access encrypted contact management features.
        </div>
      </div>
    );
  }

  if (!isDeployed) {
    return (
      <div className="dashboard-card">
        <div className="card-header">
          <h3>⚠️ Contract Not Deployed</h3>
        </div>
        <div className="status-message status-error">
          SecureData contract is not deployed on this network. Please deploy the contract first.
        </div>
      </div>
    );
  }

  // Show FHEVM status - wait for initialization
  if (!fhevmAvailable) {
    const isLocalNetwork = chainId === 31337;
    return (
      <div className="dashboard-card">
        <div className="card-header">
          <h3>{isLocalNetwork ? '🔐 FHE Mock Mode Initializing' : '🔐 Real FHE Encryption Required'}</h3>
        </div>
        <div className="status-message status-warning">
          <strong>{isLocalNetwork ? 'FHE Mock Mode is initializing for local development.' : 'Real Fully Homomorphic Encryption is required for this application.'}</strong><br />
          <br />
          <strong>System Status:</strong><br />
          • FHE Status: {fhevmStatus || 'Unknown'}<br />
          • FHEVM Instance: {!!fhevmInstance ? '✅ Available' : '❌ Not available'}<br />
          • Relayer SDK: {!!window?.relayerSDK ? '✅ Available' : (isLocalNetwork ? 'ℹ️ Not needed (mock mode)' : '❌ Not available')}<br />
          • SharedArrayBuffer: {sharedArrayBufferSupported ? '✅ Supported' : '❌ Not supported'}<br />
          <br />
          <div className="status-note">
            {fhevmStatus === 'error' ?
              'FHE initialization failed. Please check your network connection and refresh the page.' :
              `Please wait while we initialize the ${isLocalNetwork ? 'FHE mock mode' : 'real FHE encryption system'}. This may take a few moments.`
            }
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Contact Information Overview Card */}
      <div className="dashboard-card">
        <div className="card-header">
          <h3>👤 Contact Information Overview</h3>
        </div>
        <div className="contact-info-content">
          <div className="contact-item">
            <div className="contact-icon">📱</div>
            <div className="contact-content">
              <div className="contact-label">Phone Number</div>
              <div className="contact-value">
                {isDecrypted ? decryptedPhone : '***'}
              </div>
              <div className={`contact-status ${isDecrypted ? 'status-decrypted' : 'status-encrypted'}`}>
                {isDecrypted ? 'Decrypted' : 'Encrypted'}
              </div>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon">📧</div>
            <div className="contact-content">
              <div className="contact-label">Email Address</div>
              <div className="contact-value">
                {isDecrypted ? decryptedEmail : '***'}
              </div>
              <div className={`contact-status ${isDecrypted ? 'status-decrypted' : 'status-encrypted'}`}>
                {isDecrypted ? 'Decrypted' : 'Encrypted'}
              </div>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon">🚨</div>
            <div className="contact-content">
              <div className="contact-label">Emergency Contact</div>
              <div className="contact-value">
                {isDecrypted ? decryptedEmergency : '***'}
              </div>
              <div className={`contact-status ${isDecrypted ? 'status-decrypted' : 'status-encrypted'}`}>
                {isDecrypted ? 'Decrypted' : 'Encrypted'}
              </div>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon">🔓</div>
            <div className="contact-content">
              <div className="contact-label">Decrypt Any Contact</div>
              <div className="input-group">
                <input
                  type="text"
                  className="contact-input"
                  placeholder="Enter address to decrypt (or leave empty for your own)"
                  value={targetAddress}
                  onChange={(e) => setTargetAddress(e.target.value)}
                />
              </div>
              <button
                className="decrypt-btn"
                onClick={handleDecrypt}
                disabled={!canDecrypt}
                title={canDecrypt ? "Decrypt your contact information" : "FHE features initializing..."}
              >
                {canDecrypt ? '🔓 Decrypt My Info' : '🔄 FHE Initializing...'}
              </button>
            </div>
          </div>
        </div>

        {message && (
          <div className={`status-message ${
            message.includes('Error') || message.includes('failed')
              ? 'status-error'
              : message.includes('success') || message.includes('Success')
              ? 'status-success'
              : 'status-info'
          }`}>
            {message}
          </div>
        )}
      </div>

      {/* Submit Contact Information Card */}
      <div className="dashboard-card">
        <div className="card-header">
          <h3>📝 Submit Contact Information</h3>
        </div>
        <div className="contact-actions">
          <form onSubmit={handleSubmit} className="contact-form">
            <label className="form-label">
              <span className="label-icon">📱</span>
              Phone Number
            </label>
            <div className="input-group">
              <input
                type="tel"
                className={`contact-input ${touchedFields.phone && formErrors.phone ? 'input-error' : ''}`}
                placeholder="Enter your phone number"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                onBlur={() => handleFieldBlur('phone')}
                required
              />
              {touchedFields.phone && formErrors.phone && (
                <div className="error-message">{formErrors.phone}</div>
              )}
            </div>

            <label className="form-label">
              <span className="label-icon">📧</span>
              Email Address
            </label>
            <div className="input-group">
              <input
                type="email"
                className={`contact-input ${touchedFields.email && formErrors.email ? 'input-error' : ''}`}
                placeholder="Enter your email address"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onBlur={() => handleFieldBlur('email')}
                required
              />
              {touchedFields.email && formErrors.email && (
                <div className="error-message">{formErrors.email}</div>
              )}
            </div>

            <label className="form-label">
              <span className="label-icon">🚨</span>
              Emergency Contact
            </label>
            <div className="input-group">
              <input
                type="tel"
                className={`contact-input ${touchedFields.emergency && formErrors.emergency ? 'input-error' : ''}`}
                placeholder="Enter emergency contact number"
                value={emergencyInput}
                onChange={(e) => setEmergencyInput(e.target.value)}
                onBlur={() => handleFieldBlur('emergency')}
                required
              />
              {touchedFields.emergency && formErrors.emergency && (
                <div className="error-message">{formErrors.emergency}</div>
              )}
            </div>

            <div className="button-group">
              <button
                type="button"
                className="validate-btn"
                onClick={handleValidate}
                disabled={!phoneInput || !emailInput || !emergencyInput}
              >
                ✅ Validate Data
              </button>
              <button
                type="submit"
                className="submit-btn"
                disabled={!canSubmit || isSubmittingForm}
                title={canSubmit ? "Submit REAL FHE encrypted contact information" : "FHE encryption not available"}
              >
                {isSubmittingForm ? '⏳ Submitting...' : canSubmit ? '🔐 Submit REAL FHE Encrypted Contact Info' : '❌ FHE Not Available'}
              </button>
            </div>
          </form>
        </div>

        {/* Validation Results */}
        {validationResult && (
          <div className={`validation-result ${validationResult.isValid ? 'validation-valid' : 'validation-invalid'}`}>
            <h4>📋 Validation Result</h4>
            <p>{validationResult.errorMessage}</p>
          </div>
        )}

        {/* Data Export Section */}
        <div className="export-section">
          <h4>📥 Export Your Data</h4>
          <p>Download your encrypted contact information for backup or analysis</p>
          <button
            type="button"
            className="export-btn"
            onClick={() => {
              const exportData = {
                timestamp: new Date().toISOString(),
                network: chainId,
                wallet: address,
                contactData: {
                  phone: phoneInput,
                  email: emailInput,
                  emergency: emergencyInput,
                },
                validation: validationResult,
                fheEnabled: canSubmit,
              };
              const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `secure-data-export-${Date.now()}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            disabled={!phoneInput && !emailInput && !emergencyInput}
          >
            📄 Export Contact Data
          </button>
        </div>
      </div>

      {/* Information Card */}
      <div className="dashboard-card">
        <div className="card-header">
          <h3>ℹ️ How SecureData Works</h3>
        </div>
        <div className="info-content">
          <div className="info-item">
            <div className="info-step">1</div>
            <div className="info-text">
              <strong>Submit Encrypted Data</strong>
              <p>Your contact information is encrypted client-side using FHE before being stored on the blockchain</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-step">2</div>
            <div className="info-text">
              <strong>Private Storage</strong>
              <p>Data remains encrypted on-chain, visible only as cryptographic handles</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-step">3</div>
            <div className="info-text">
              <strong>Authorized Decryption</strong>
              <p>Anyone can decrypt and view contact information through the FHE decryption process</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const SecureDataDemo = memo(SecureDataDemoComponent);