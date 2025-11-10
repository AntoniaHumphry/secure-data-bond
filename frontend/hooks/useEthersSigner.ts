import { useMemo, useState, useEffect } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { ethers } from 'ethers';

export function useEthersSigner() {
  const { data: walletClient } = useWalletClient();
  const { isConnected } = useAccount();
  const [signer, setSigner] = useState<ethers.Signer | undefined>(undefined);

  useEffect(() => {
    const getSigner = async () => {
      if (!walletClient || !isConnected) {
        setSigner(undefined);
        return;
      }

      const { account, chain, transport } = walletClient;

      const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
      };

      const provider = new ethers.BrowserProvider(transport, network);
      const signer = await provider.getSigner(account.address);
      setSigner(signer);
    };

    getSigner();
  }, [walletClient, isConnected]);

  return signer;
}
