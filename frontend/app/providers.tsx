"use client";

import type { ReactNode } from "react";
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

import { config } from '../src/config/wagmi';
import { InMemoryStorageProvider } from "@/hooks/useInMemoryStorage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Disable background refetching to prevent network errors
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      // Add retry logic for network errors
      retry: (failureCount, error) => {
        // Don't retry on network errors (like network changes)
        if (error?.message?.includes('network changed')) {
          return false;
        }
        return failureCount < 3;
      },
      // Shorter stale time for network-dependent data
      staleTime: 30000, // 30 seconds
    },
    mutations: {
      // Retry mutations on network errors
      retry: (failureCount, error) => {
        if (error?.message?.includes('network changed')) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

type Props = {
  children: ReactNode;
};

export function Providers({ children }: Props) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider locale="en">
          <InMemoryStorageProvider>{children}</InMemoryStorageProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
