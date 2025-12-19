export interface ContactFormData {
  phone: string;
  email: string;
  emergency: string;
}

export interface ValidationResult {
  isValid: boolean;
  errorMessage: string;
}

export interface DecryptedContactInfo {
  phoneNumber: number;
  emailHash: number;
  emergencyContact: number;
  name: string;
  email: string;
  decrypted: boolean;
}

export interface EncryptedContactInfo {
  handles: string[];
  inputProof: string;
}

export type ContactFieldType = 'phone' | 'email' | 'emergency';

export interface ContactSubmissionData {
  phone: string;
  email: number;
  emergency: string;
  emailStr: string;
}








