# SecureData - Encrypted Personal Contact Information

A Hardhat-based template for developing Fully Homomorphic Encryption (FHE) enabled Solidity smart contracts using the
FHEVM protocol by Zama. This project implements secure storage and retrieval of personal contact information with
real FHE encryption/decryption capabilities.

## Links

- **Live Demo**: [https://secure-data-kappa.vercel.app/](https://secure-data-kappa.vercel.app/)
- **Demo Video**: [https://github.com/AntoniaHumphry/secure-data-bond/blob/main/secure-data.mp4](https://github.com/AntoniaHumphry/secure-data-bond/blob/main/secure-data.mp4)

## Quick Start

For detailed instructions see:
[FHEVM Hardhat Quick Start Tutorial](https://docs.zama.ai/protocol/solidity-guides/getting-started/quick-start-tutorial)

### Prerequisites

- **Node.js**: Version 20 or higher
- **npm or yarn/pnpm**: Package manager

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   ```bash
   npx hardhat vars set MNEMONIC

   # Set your Infura API key for network access
   npx hardhat vars set INFURA_API_KEY

   # Optional: Set Etherscan API key for contract verification
   npx hardhat vars set ETHERSCAN_API_KEY
   ```

3. **Compile and test**

   ```bash
   npm run compile
   npm run test
   ```

4. **Deploy to local network**

## 🔐 FHE Features

This project implements **real Fully Homomorphic Encryption** for personal contact information:

### Real FHE Encryption
- **Client-side encryption**: Contact information is encrypted on the client using FHEVM SDK
- **Blockchain storage**: Encrypted data is stored on-chain as `euint8` types
- **Homomorphic operations**: Contract performs FHE operations (comparisons, selections) on encrypted data
- **Access control**: Users can decrypt only their own data via wallet confirmation

### Key Functions
- `submitContactInfo()`: Encrypt and store contact information
- `decryptContactInfo(address)`: Decrypt any user's stored information (anyone can call)
- `hasContactInfo()`: Check if user data exists using FHE comparisons
- `isContactInfoComplete()`: Verify all fields are filled using encrypted logic
- `getDecryptedContactInfo()`: Get already decrypted information for any user

### Security Benefits
- **Privacy preservation**: Data remains encrypted on-chain
- **Public decryption**: Anyone can decrypt anyone's contact information at any time
- **Zero-knowledge verification**: Contract can validate data completeness without seeing content
- **Transparency**: Full visibility of all stored contact information

## 🚀 Quick Start

   ```bash
   # Start a local FHEVM-ready node
   npx hardhat node
   # Deploy to local network
   npx hardhat deploy --network localhost
   ```

5. **Deploy to Sepolia Testnet**

   ```bash
   # Deploy to Sepolia
   npx hardhat deploy --network sepolia
   # Verify contract on Etherscan
   npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
   ```

6. **Test on Sepolia Testnet**

   ```bash
   # Once deployed, you can run a simple test on Sepolia.
   npx hardhat test --network sepolia
   ```

## 📁 Project Structure

```
fhevm-hardhat-template/
├── contracts/           # Smart contract source files
│   └── FHECounter.sol   # Example FHE counter contract
├── deploy/              # Deployment scripts
├── tasks/               # Hardhat custom tasks
├── test/                # Test files
├── hardhat.config.ts    # Hardhat configuration
└── package.json         # Dependencies and scripts
```

## 📜 Available Scripts

| Script             | Description              |
| ------------------ | ------------------------ |
| `npm run compile`  | Compile all contracts    |
| `npm run test`     | Run all tests            |
| `npm run coverage` | Generate coverage report |
| `npm run lint`     | Run linting checks       |
| `npm run clean`    | Clean build artifacts    |

## 📚 Documentation

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [FHEVM Hardhat Setup Guide](https://docs.zama.ai/protocol/solidity-guides/getting-started/setup)
- [FHEVM Testing Guide](https://docs.zama.ai/protocol/solidity-guides/development-guide/hardhat/write_test)
- [FHEVM Hardhat Plugin](https://docs.zama.ai/protocol/solidity-guides/development-guide/hardhat)

## 📄 License

This project is licensed under the BSD-3-Clause-Clear License. See the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/zama-ai/fhevm/issues)
- **Documentation**: [FHEVM Docs](https://docs.zama.ai)
- **Community**: [Zama Discord](https://discord.gg/zama)

---

**Built with ❤️ by the Zama team**

# Additional Notes
- Project demonstrates FHEVM integration with React frontend
- Supports both local development (mock mode) and testnet deployment
