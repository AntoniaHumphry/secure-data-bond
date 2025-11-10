#!/bin/bash

# SecureData Contract Deployment Script
# This script handles deployment to both local and test networks

set -e  # Exit on any error

echo "🚀 SecureData Contract Deployment Script"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if Node.js and npm are installed
check_dependencies() {
    print_status "Checking dependencies..."

    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi

    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 20 ]; then
        print_error "Node.js version 20 or higher is required. Current version: $(node --version)"
        exit 1
    fi

    print_success "Dependencies check passed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."

    if [ ! -d "node_modules" ]; then
        npm install
        print_success "Dependencies installed"
    else
        print_success "Dependencies already installed"
    fi
}

# Compile contracts
compile_contracts() {
    print_status "Compiling contracts..."

    npx hardhat compile

    if [ $? -eq 0 ]; then
        print_success "Contracts compiled successfully"
    else
        print_error "Contract compilation failed"
        exit 1
    fi
}

# Deploy to localhost
deploy_localhost() {
    print_status "Starting local Hardhat node..."

    # Check if hardhat node is already running
    if lsof -Pi :8545 -sTCP:LISTEN -t >/dev/null ; then
        print_warning "Hardhat node is already running on port 8545"
    else
        # Start hardhat node in background
        npx hardhat node > hardhat-node.log 2>&1 &
        HARDHAT_PID=$!
        print_success "Hardhat node started (PID: $HARDHAT_PID)"

        # Wait for node to start
        sleep 3
    fi

    print_status "Deploying to localhost..."

    # Deploy contracts
    DEPLOY_OUTPUT=$(npx hardhat deploy --network localhost 2>&1)

    if [ $? -eq 0 ]; then
        print_success "Local deployment completed"

        # Extract contract address from output
        CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "SecureData contract:" | awk '{print $NF}')

        if [ ! -z "$CONTRACT_ADDRESS" ]; then
            print_success "Contract deployed at: $CONTRACT_ADDRESS"

            # Update localhost addresses
            update_addresses "localhost" "$CONTRACT_ADDRESS"
        fi

        echo "$DEPLOY_OUTPUT"
    else
        print_error "Local deployment failed"
        echo "$DEPLOY_OUTPUT"
        exit 1
    fi
}

# Deploy to Sepolia
deploy_sepolia() {
    print_status "Deploying to Sepolia testnet..."

    # Check environment variables
    if [ -z "$MNEMONIC" ]; then
        print_error "MNEMONIC environment variable is not set"
        print_error "Please set it with: export MNEMONIC='your_12_word_mnemonic'"
        exit 1
    fi

    if [ -z "$INFURA_API_KEY" ]; then
        print_warning "INFURA_API_KEY not set, using default"
    fi

    # Deploy to Sepolia
    DEPLOY_OUTPUT=$(npx hardhat deploy --network sepolia 2>&1)

    if [ $? -eq 0 ]; then
        print_success "Sepolia deployment completed"

        # Extract contract address from output
        CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "SecureData contract:" | awk '{print $NF}')

        if [ ! -z "$CONTRACT_ADDRESS" ]; then
            print_success "Contract deployed at: $CONTRACT_ADDRESS"

            # Update Sepolia addresses
            update_addresses "sepolia" "$CONTRACT_ADDRESS"
        fi

        echo "$DEPLOY_OUTPUT"
    else
        print_error "Sepolia deployment failed"
        echo "$DEPLOY_OUTPUT"
        exit 1
    fi
}

# Update address files
update_addresses() {
    local network=$1
    local address=$2

    print_status "Updating $network address to: $address"

    # Update deployments file
    mkdir -p "deployments/$network"

    # Create deployment JSON
    cat > "deployments/$network/SecureData.json" << EOF
{
  "address": "$address",
  "abi": $(cat artifacts/contracts/SecureData.sol/SecureData.json | jq '.abi'),
  "chainId": $(if [ "$network" = "localhost" ]; then echo "31337"; else echo "11155111"; fi),
  "contractName": "SecureData",
  "deployedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF

    # Update frontend ABI addresses
    if [ "$network" = "localhost" ]; then
        sed -i.bak "s|\"31337\": { address: \"[^\"]*\"|\"31337\": { address: \"$address\"|g" frontend/abi/SecureDataAddresses.ts
    else
        sed -i.bak "s|\"11155111\": { address: \"[^\"]*\"|\"11155111\": { address: \"$address\"|g" frontend/abi/SecureDataAddresses.ts
    fi

    print_success "$network addresses updated"
}

# Generate ABI
generate_abi() {
    print_status "Generating ABI files..."

    node frontend/scripts/genabi.mjs

    if [ $? -eq 0 ]; then
        print_success "ABI files generated"
    else
        print_error "ABI generation failed"
        exit 1
    fi
}

# Run tests
run_tests() {
    print_status "Running tests..."

    if [ "$1" = "localhost" ]; then
        npx hardhat test
    else
        npx hardhat test --network sepolia
    fi

    if [ $? -eq 0 ]; then
        print_success "Tests passed"
    else
        print_warning "Some tests failed"
    fi
}

# Main deployment flow
main() {
    local network=${1:-"localhost"}

    echo "Network: $network"
    echo

    check_dependencies
    install_dependencies
    compile_contracts

    if [ "$network" = "localhost" ]; then
        deploy_localhost
    elif [ "$network" = "sepolia" ]; then
        deploy_sepolia
    else
        print_error "Invalid network. Use 'localhost' or 'sepolia'"
        exit 1
    fi

    generate_abi
    run_tests "$network"

    print_success "🎉 Deployment completed successfully!"
    print_status "Next steps:"
    echo "  1. Start frontend: cd frontend && npm run dev"
    echo "  2. Open browser and test the application"
    echo "  3. Verify FHE encryption/decryption works"
}

# Help message
show_help() {
    cat << EOF
SecureData Contract Deployment Script

Usage: $0 [network]

Networks:
  localhost    Deploy to local Hardhat network (default)
  sepolia      Deploy to Sepolia testnet

Environment Variables:
  MNEMONIC        Your 12-word mnemonic (required for Sepolia)
  INFURA_API_KEY  Your Infura API key (optional, has default)

Examples:
  $0                    # Deploy to localhost
  $0 localhost          # Deploy to localhost
  $0 sepolia            # Deploy to Sepolia

EOF
}

# Parse arguments
case "${1:-}" in
    -h|--help)
        show_help
        exit 0
        ;;
    localhost|sepolia|"")
        main "${1:-localhost}"
        ;;
    *)
        print_error "Invalid argument: $1"
        show_help
        exit 1
        ;;
esac
