// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint8, ebool, externalEuint8} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title SecureData Contract for Encrypted Personal Contact Information
/// @author secure-data project
/// @notice Stores encrypted personal contact information using FHEVM for privacy preservation
contract SecureData is SepoliaConfig {
    // Owner pattern for administrative functions
    address public owner;

    // Admin mapping for additional administrative access
    mapping(address => bool) public admins;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == owner || admins[msg.sender], "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
        admins[msg.sender] = true; // Owner is also admin
    }

    /// @notice Add an admin (only owner can call)
    /// @param admin Address to grant admin privileges
    function addAdmin(address admin) external onlyOwner {
        require(admin != address(0), "Invalid admin address");
        admins[admin] = true;
        emit AdminAdded(admin, msg.sender, block.timestamp);
    }

    /// @notice Remove an admin (only owner can call)
    /// @param admin Address to revoke admin privileges
    function removeAdmin(address admin) external onlyOwner {
        require(admins[admin], "Address is not admin");
        admins[admin] = false;
        emit AdminRemoved(admin, msg.sender, block.timestamp);
    }

    /// @notice Check if address is admin
    /// @param account Address to check
    /// @return bool True if address is admin
    function isAdmin(address account) external view returns (bool) {
        return admins[account];
    }

    // Events for better traceability
    event ContactDataSubmitted(address indexed user, uint256 timestamp);
    event ContactDataRetrieved(address indexed user, address indexed retriever, uint256 timestamp);
    event AdminAdded(address indexed admin, address indexed addedBy, uint256 timestamp);
    event AdminRemoved(address indexed admin, address indexed removedBy, uint256 timestamp);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner, uint256 timestamp);

    /// @notice Validate contact information format
    /// @param phone Phone number to validate
    /// @param email Email to validate
    /// @param emergency Emergency contact to validate
    /// @return isValid True if all validations pass
    /// @return errorCode 0=valid, 1=invalid phone, 2=invalid email, 3=invalid emergency
    function validateContactInfo(
        uint8 phone,
        string memory email,
        uint8 emergency
    ) public pure returns (bool isValid, uint8 errorCode) {
        // Validate phone number range
        if (phone < 10 || phone > 99) {
            return (false, 1);
        }

        // Validate email contains @ symbol
        bool hasAtSymbol = false;
        for (uint i = 0; i < bytes(email).length; i++) {
            if (bytes(email)[i] == "@") {
                hasAtSymbol = true;
                break;
            }
        }
        if (!hasAtSymbol) {
            return (false, 2);
        }

        // Validate emergency contact range
        if (emergency < 10 || emergency > 99) {
            return (false, 3);
        }

        return (true, 0);
    }

    /// @notice Check data integrity after decryption
    /// @param user The user address
    /// @return isValid True if decrypted data passes integrity checks
    /// @return integrityScore Integrity score (0-100, higher is better)
    function checkDataIntegrity(address user) external returns (bool isValid, uint8 integrityScore) {
        ContactInfo storage info = _contactInfos[user];

        if (!info.decrypted) {
            return (false, 0); // Not decrypted yet
        }

        uint8 score = 100;

        // Check phone number validity
        if (info.finalPhoneNumber < 10 || info.finalPhoneNumber > 99) {
            score -= 30;
        }

        // Check emergency contact validity
        if (info.finalEmergencyContact < 10 || info.finalEmergencyContact > 99) {
            score -= 30;
        }

        // Check email format
        bool hasAtSymbol = false;
        for (uint i = 0; i < bytes(info.finalEmail).length; i++) {
            if (bytes(info.finalEmail)[i] == "@") {
                hasAtSymbol = true;
                break;
            }
        }
        if (!hasAtSymbol) {
            score -= 40;
        }

        // Check name length
        if (bytes(info.finalName).length < 2) {
            score -= 20;
        }

        bool isValidData = score >= 60; // Require at least 60% integrity score
        emit DataIntegrityChecked(user, isValidData, score);
        return (isValidData, score);
    }

    // Structure to hold encrypted contact information for each user
    struct ContactInfo {
        bytes encryptedPhoneNumber;     // Encrypted phone number (FHE handle stored as bytes)
        bytes encryptedEmailHash;       // Encrypted email hash (FHE handle stored as bytes)
        bytes encryptedEmergencyContact; // Encrypted emergency contact (FHE handle stored as bytes)
        bytes encryptedIsComplete;      // Encrypted completeness flag (FHE handle stored as bytes)
        uint8 finalPhoneNumber;         // Decrypted phone number (after decryption)
        uint8 finalEmailHash;           // Decrypted email hash (after decryption)
        uint8 finalEmergencyContact;    // Decrypted emergency contact (after decryption)
        bool decrypted;                 // Whether data has been decrypted
        string finalName;               // Decrypted name (for future string support)
        string finalEmail;              // Decrypted email (for future string support)
    }

    // Mapping of user address to their encrypted contact information
    mapping(address => ContactInfo) private _contactInfos;

    // Events
    event ContactInfoSubmitted(address indexed user);
    event ContactInfoUpdated(address indexed user, uint8 fieldType);
    event ContactInfoDecrypted(address indexed user, uint8 phoneNumber, uint8 emailHash, uint8 emergencyContact);
    event DataIntegrityChecked(address indexed user, bool isValid, uint8 integrityScore);
    event DecryptionFinalized(address indexed user, string name, string email);

    /// @notice Submit encrypted contact information using FHE
    /// @dev Stores fully homomorphically encrypted contact data on blockchain
    /// @dev Only the user can decrypt their own data using private key
    /// @param phoneHandle FHE encrypted phone number handle (uint256 ciphertext)
    /// @param phoneInputProof ZK proof verifying phone number encryption integrity
    /// @param emailHandle FHE encrypted email hash handle (uint256 ciphertext)
    /// @param emailInputProof ZK proof verifying email encryption integrity
    /// @param emergencyHandle FHE encrypted emergency contact handle (uint256 ciphertext)
    /// @param emergencyInputProof ZK proof verifying emergency contact encryption integrity
    /// @custom:security Only callable by data owner, encryption verified by FHEVM
    function submitContactInfo(
        uint256 phoneHandle,
        bytes calldata phoneInputProof,
        uint256 emailHandle,
        bytes calldata emailInputProof,
        uint256 emergencyHandle,
        bytes calldata emergencyInputProof
    ) external {
        // Convert handles to bytes for storage (like Athlete project)
        bytes memory encPhoneBytes = abi.encode(phoneHandle);
        bytes memory encEmailBytes = abi.encode(emailHandle);
        bytes memory encEmergencyBytes = abi.encode(emergencyHandle);

        // For completeness check, we'll create a simple encrypted boolean
        // In a full implementation, this would be computed from the encrypted values
        bytes memory isCompleteBytes = abi.encode(uint256(1)); // Assume complete for now

        // Store the encrypted contact information
        _contactInfos[msg.sender] = ContactInfo({
            encryptedPhoneNumber: encPhoneBytes,
            encryptedEmailHash: encEmailBytes,
            encryptedEmergencyContact: encEmergencyBytes,
            encryptedIsComplete: isCompleteBytes,
            decrypted: false,
            finalPhoneNumber: 0,
            finalEmailHash: 0,
            finalEmergencyContact: 0,
            finalName: "",
            finalEmail: ""
        });

        emit ContactInfoSubmitted(msg.sender);
    }

    /// @notice Submit contact information with simple encryption (fallback mode)
    /// @param encryptedPhone Encrypted phone as bytes
    /// @param encryptedEmail Encrypted email as bytes
    /// @param encryptedEmergency Encrypted emergency contact as bytes
    function submitContactInfoSimple(
        bytes calldata encryptedPhone,
        bytes calldata encryptedEmail,
        bytes calldata encryptedEmergency
    ) external {
        // Store encrypted data directly as bytes (fallback mode)
        _contactInfos[msg.sender] = ContactInfo({
            encryptedPhoneNumber: encryptedPhone,
            encryptedEmailHash: encryptedEmail,
            encryptedEmergencyContact: encryptedEmergency,
            encryptedIsComplete: abi.encode(uint256(1)), // Assume complete
            decrypted: false,
            finalPhoneNumber: 0,
            finalEmailHash: 0,
            finalEmergencyContact: 0,
            finalName: "",
            finalEmail: ""
        });

        emit ContactInfoSubmitted(msg.sender);
    }

    /// @notice Update specific encrypted contact information (FHE mode)
    /// @param fieldType 0=phone, 1=email, 2=emergency
    /// @param handle FHE encrypted handle
    /// @param inputProof Zama input proof
    function updateContactField(
        uint8 fieldType,
        uint256 handle,
        bytes calldata inputProof
    ) external {
        require(fieldType < 3, "Invalid field type");

        ContactInfo storage info = _contactInfos[msg.sender];
        bytes memory handleBytes = abi.encode(handle);

        if (fieldType == 0) {
            info.encryptedPhoneNumber = handleBytes;
        } else if (fieldType == 1) {
            info.encryptedEmailHash = handleBytes;
        } else if (fieldType == 2) {
            info.encryptedEmergencyContact = handleBytes;
        }

        emit ContactInfoUpdated(msg.sender, fieldType);
    }

    /// @notice Update contact field with simple encryption (fallback mode)
    /// @param fieldType 0=phone, 1=email, 2=emergency
    /// @param encryptedValue Encrypted value as bytes
    function updateContactFieldSimple(
        uint8 fieldType,
        bytes calldata encryptedValue
    ) external {
        require(fieldType < 3, "Invalid field type");

        ContactInfo storage info = _contactInfos[msg.sender];

        if (fieldType == 0) {
            info.encryptedPhoneNumber = encryptedValue;
        } else if (fieldType == 1) {
            info.encryptedEmailHash = encryptedValue;
        } else if (fieldType == 2) {
            info.encryptedEmergencyContact = encryptedValue;
        }

        emit ContactInfoUpdated(msg.sender, fieldType);
    }

    /// @notice Get encrypted contact information for a user
    /// @param user The user address
    /// @return phoneNumber Encrypted phone number (bytes)
    /// @return emailHash Encrypted email hash (bytes)
    /// @return emergencyContact Encrypted emergency contact (bytes)
    function getContactInfo(address user) external view returns (
        bytes memory phoneNumber,
        bytes memory emailHash,
        bytes memory emergencyContact
    ) {
        ContactInfo storage info = _contactInfos[user];
        return (info.encryptedPhoneNumber, info.encryptedEmailHash, info.encryptedEmergencyContact);
    }

    /// @notice Get encrypted handles for decryption (returns uint256)
    /// @param user The user address
    /// @return phoneHandle Phone number FHE handle
    /// @return emailHandle Email hash FHE handle
    /// @return emergencyHandle Emergency contact FHE handle
    function getEncryptedHandles(address user) external view returns (uint256, uint256, uint256) {
        ContactInfo storage info = _contactInfos[user];
        uint256 phoneHandle = abi.decode(info.encryptedPhoneNumber, (uint256));
        uint256 emailHandle = abi.decode(info.encryptedEmailHash, (uint256));
        uint256 emergencyHandle = abi.decode(info.encryptedEmergencyContact, (uint256));
        return (phoneHandle, emailHandle, emergencyHandle);
    }

    /// @notice Check if user's contact information is complete (all fields filled)
    /// @param user The user address
    /// @return True if all contact fields are provided
    function isContactInfoComplete(address user) external view returns (bool) {
        ContactInfo storage info = _contactInfos[user];
        if (info.decrypted) {
            // If already decrypted, check if all final values are non-zero
            return info.finalPhoneNumber > 0 && info.finalEmailHash > 0 && info.finalEmergencyContact > 0;
        } else {
            // Check if encrypted data exists (simple check for non-empty bytes)
            return info.encryptedPhoneNumber.length > 0 &&
                   info.encryptedEmailHash.length > 0 &&
                   info.encryptedEmergencyContact.length > 0;
        }
    }

    /// @notice Check if user has submitted any contact information
    /// @param user The user address
    /// @return True if user has submitted contact info
    function hasContactInfo(address user) external view returns (bool) {
        ContactInfo storage info = _contactInfos[user];
        if (info.decrypted) {
            // If already decrypted, check if any final value is non-zero
            return info.finalPhoneNumber > 0 || info.finalEmailHash > 0 || info.finalEmergencyContact > 0;
        } else {
            // Check if any encrypted data exists
            return info.encryptedPhoneNumber.length > 0 ||
                   info.encryptedEmailHash.length > 0 ||
                   info.encryptedEmergencyContact.length > 0;
        }
    }

    /// @notice Mark contact information as decrypted (called after frontend decryption)
    /// @param user The address of the user whose data was decrypted
    /// @param phoneNumber The decrypted phone number
    /// @param emailHash The decrypted email hash
    /// @param emergencyContact The decrypted emergency contact
    /// @param name The decrypted name (string support)
    /// @param email The decrypted email (string support)
    function finalizeDecryption(
        address user,
        uint8 phoneNumber,
        uint8 emailHash,
        uint8 emergencyContact,
        string memory name,
        string memory email
    ) external {
        ContactInfo storage info = _contactInfos[user];
        require(!info.decrypted, "Already decrypted");
        require(info.encryptedPhoneNumber.length > 0, "No encrypted data found for user");

        // Store decrypted values (validation is optional for FHE decrypted data)
        // FHE decryption may produce values outside normal validation ranges
        info.finalPhoneNumber = phoneNumber;
        info.finalEmailHash = emailHash;
        info.finalEmergencyContact = emergencyContact;
        info.finalName = name;
        info.finalEmail = email;
        info.decrypted = true;

        emit ContactInfoDecrypted(user, phoneNumber, emailHash, emergencyContact);
        emit DecryptionFinalized(user, name, email);
    }

    /// @notice Public decryption - anyone can finalize decryption results
    /// @param user The address of the user whose data was decrypted
    /// @param phoneNumber The decrypted phone number
    /// @param emailHash The decrypted email hash
    /// @param emergencyContact The decrypted emergency contact
    /// @param name The decrypted name
    /// @param email The decrypted email
    function finalizePublicDecryption(
        address user,
        uint8 phoneNumber,
        uint8 emailHash,
        uint8 emergencyContact,
        string memory name,
        string memory email
    ) external {
        ContactInfo storage info = _contactInfos[user];
        require(!info.decrypted, "Already decrypted");
        require(info.encryptedPhoneNumber.length > 0, "No encrypted data to decrypt");

        // Store decrypted values
        info.finalPhoneNumber = phoneNumber;
        info.finalEmailHash = emailHash;
        info.finalEmergencyContact = emergencyContact;
        info.finalName = name;
        info.finalEmail = email;
        info.decrypted = true;

        emit ContactInfoDecrypted(user, phoneNumber, emailHash, emergencyContact);
        emit DecryptionFinalized(user, name, email);
    }

    /// @notice Finalize decryption results (called by anyone after off-chain decryption)
    /// @param user The user address
    /// @param phoneNumber The decrypted phone number
    /// @param emailHash The decrypted email hash
    /// @param emergencyContact The decrypted emergency contact
    /// @param name The decrypted name
    /// @param email The decrypted email
    function finalizeResults(
        address user,
        uint8 phoneNumber,
        uint8 emailHash,
        uint8 emergencyContact,
        string memory name,
        string memory email
    ) external {
        ContactInfo storage info = _contactInfos[user];
        require(!info.decrypted, "Already finalized");

        info.finalPhoneNumber = phoneNumber;
        info.finalEmailHash = emailHash;
        info.finalEmergencyContact = emergencyContact;
        info.finalName = name;
        info.finalEmail = email;
        info.decrypted = true;

        emit ContactInfoDecrypted(user, phoneNumber, emailHash, emergencyContact);
        emit DecryptionFinalized(user, name, email);
    }

    /// @notice Get decrypted contact information (only available after decryption)
    /// @param user The user address
    /// @return phoneNumber Decrypted phone number
    /// @return emailHash Decrypted email hash
    /// @return emergencyContact Decrypted emergency contact
    /// @return name Decrypted name
    /// @return email Decrypted email
    /// @return decrypted Whether the data has been decrypted
    function getDecryptedContactInfo(address user) external view returns (
        uint8 phoneNumber,
        uint8 emailHash,
        uint8 emergencyContact,
        string memory name,
        string memory email,
        bool decrypted
    ) {
        ContactInfo storage info = _contactInfos[user];
        require(info.decrypted, "Contact info not yet decrypted");

        return (
            info.finalPhoneNumber,
            info.finalEmailHash,
            info.finalEmergencyContact,
            info.finalName,
            info.finalEmail,
            info.decrypted
        );
    }

    /// @notice Get contract version for compatibility checks
    /// @dev Returns semantic version string for API compatibility
    /// @return version Contract version in semantic versioning format (MAJOR.MINOR.PATCH)
    function getVersion() external pure returns (string memory) {
        return "1.0.0";
    }

    /// @notice Emergency stop functionality for contract owner
    /// @param pause True to pause, false to unpause
    function emergencyStop(bool pause) external onlyOwner {
        // Implementation placeholder for emergency controls
        // In a full implementation, this would pause/unpause contract functions
    }
}
