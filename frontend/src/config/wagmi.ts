import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, hardhat } from 'wagmi/chains';
import { http } from 'wagmi';

const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY || 'b18fb7e6ca7045ac83c41157ab93f990';
const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'ef3325a718834a2b1b4134d3f520933d';

export const config = getDefaultConfig({
  appName: 'SecureData',
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [
    sepolia,
    hardhat
  ],
  transports: {
    [sepolia.id]: http(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`),
    [hardhat.id]: http('http://127.0.0.1:8545'),
  },
  ssr: false,
});
