#!/bin/bash

# Environment Setup Script for SecureData Deployment
# This script helps set up the environment variables needed for deployment

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "🔧 SecureData Environment Setup"
echo "==============================="

# Check if .env file exists
if [ -f ".env" ]; then
    print_warning ".env file already exists. Backing up..."
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
fi

# Create .env file
cat > .env << 'EOF'
# SecureData Deployment Environment Variables
# Copy this file and fill in your actual values

# ========== REQUIRED FOR SEPOLIA DEPLOYMENT ==========
# Your 12-word mnemonic phrase (keep this secure!)
MNEMONIC="test test test test test test test test test test test junk"

# ========== OPTIONAL ==========
# Infura API Key for Sepolia network access
INFURA_API_KEY="b18fb7e6ca7045ac83c41157ab93f990"

# Etherscan API Key for contract verification (optional)
ETHERSCAN_API_KEY=""

# ========== FRONTEND CONFIGURATION ==========
# WalletConnect Project ID (already configured)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="ef3325a718834a2b1b4134d3f520933d"

# ========== DEVELOPMENT ==========
# Enable debug logging
DEBUG=false

# Local Hardhat node port
HARDHAT_PORT=8545
EOF

print_success "Environment file created: .env"
print_warning "IMPORTANT: Edit .env file with your actual values before deployment!"

# Make scripts executable
chmod +x deploy-contracts.sh
chmod +x setup-env.sh

print_success "Scripts made executable"

# Show next steps
echo
print_status "Next steps:"
echo "1. Edit .env file with your actual mnemonic and API keys"
echo "2. Run: source .env  # Load environment variables"
echo "3. Deploy locally: ./deploy-contracts.sh localhost"
echo "4. Deploy to Sepolia: ./deploy-contracts.sh sepolia"
echo
print_warning "SECURITY NOTE:"
echo "- Never commit .env file to version control"
echo "- Keep your mnemonic secure and never share it"
echo "- Use a dedicated account with minimal funds for testing"
