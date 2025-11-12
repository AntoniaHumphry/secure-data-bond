"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useAccount, useWalletClient } from 'wagmi';
import { useSecureData } from "@/hooks/useSecureData";
import { useFhevm } from "@/fhevm/useFhevm";
import { useInMemoryStorage } from "@/hooks/useInMemoryStorage";
import { useEthersSigner } from "@/hooks/useEthersSigner";
import type { ValidationResult, ContactFormData } from "@/types/contact";

export const SecureDataDemo = () => {
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
  const fhevmEnabled = isConnected && mounted && fhevmDelayPassed && typeof window !== 'undefined' && !!window?.ethereum;

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

    // Basic phone validation (should be 2 digits for demo)
    if (phoneInput.length !== 2 || isNaN(Number(phoneInput))) {
      setValidationResult({isValid: false, errorMessage: "Phone number should be 2 digits"});
      return;
    }

    // Basic emergency validation (should be 2 digits for demo)
    if (emergencyInput.length !== 2 || isNaN(Number(emergencyInput))) {
      setValidationResult({isValid: false, errorMessage: "Emergency contact should be 2 digits"});
      return;
    }

    setValidationResult({isValid: true, errorMessage: ""});

    // Set submitting state
    setIsSubmittingForm(true);
    try {
      await submitContactInfo(
        parseInt(phoneInput),
        parseInt(emailInput),
        parseInt(emergencyInput),
        emailInput,
        {
          phone: phoneInput.trim(),
          email: emailInput.trim(),
          emergency: emergencyInput.trim()
        }
      );
    } finally {
      setIsSubmittingForm(false);
    }

    // Store original user inputs for display purposes
    const originalPhone = phoneInput.trim();
    const originalEmail = emailInput.trim();
    const originalEmergency = emergencyInput.trim();

    // Convert inputs to numbers for contract submission
    const phoneNum = parseInt(phoneInput.replace(/\D/g, '')) || 0;

    // Convert email to numeric representation (first 8 chars as ASCII codes)
    const emailStr = emailInput.trim();
    let emailNum = 0;
    for (let i = 0; i < Math.min(emailStr.length, 8); i++) {
      emailNum = emailNum * 256 + emailStr.charCodeAt(i);
    }
    // Ensure emailNum is within uint8 range (0-255) for contract compatibility
    emailNum = emailNum % 256;

    const emergencyNum = parseInt(emergencyInput.replace(/\D/g, '')) || 0;

    // Store original inputs in lastSubmittedData before submitting
    // This will be used for decryption display
    const lastSubmittedData = {
      phone: originalPhone, // Store as string for display
      email: emailNum, // Still need numeric for contract
      emergency: originalEmergency, // Store as string for display
      emailStr: originalEmail, // Store original email string
    };

    await submitContactInfo(phoneNum, emailNum, emergencyNum, emailStr, lastSubmittedData);
  }, [phoneInput, emailInput, emergencyInput, submitContactInfo, setValidationResult, setIsSubmittingForm]);

  const handleDecrypt = async () => {
    const addressToDecrypt = targetAddress || address || '';
    if (!addressToDecrypt) return;

    await decryptContactInfo(addressToDecrypt);
  };


  const handleValidate = async () => {
    const phoneNum = parseInt(phoneInput.replace(/\D/g, '')) || 0;
    const emergencyNum = parseInt(emergencyInput.replace(/\D/g, '')) || 0;

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
          {!mounted ? 'Loading SecureData application...' : 'Initializing FHE encryption system...'}
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
                className="contact-input"
                placeholder="Enter your phone number"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                required
              />
            </div>

            <label className="form-label">
              <span className="label-icon">📧</span>
              Email Address
            </label>
            <div className="input-group">
              <input
                type="email"
                className="contact-input"
                placeholder="Enter your email address"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
              />
            </div>

            <label className="form-label">
              <span className="label-icon">🚨</span>
              Emergency Contact
            </label>
            <div className="input-group">
              <input
                type="tel"
                className="contact-input"
                placeholder="Enter emergency contact number"
                value={emergencyInput}
                onChange={(e) => setEmergencyInput(e.target.value)}
                required
              />
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