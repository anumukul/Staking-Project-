'use client'

import { useEffect } from 'react'
import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { mainnet, sepolia, localhost } from 'wagmi/chains'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const { chains, publicClient } = configureChains(
  [sepolia, mainnet, localhost], // Sepolia first since contracts are deployed there
  [
    infuraProvider({ 
      apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY || 'dummy-key' 
    }),
    publicProvider(), // Fallback to public RPC if Infura fails
  ]
)

const { connectors } = getDefaultWallets({
  appName: 'Staking DApp',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains,
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Retry once on failure
      retryDelay: 1000, // Wait 1 second before retry
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  // Suppress ENS errors globally
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const originalError = console.error.bind(console)
    console.error = (...args: any[]) => {
      const message = String(args[0] || '')
      const allArgs = args.map(String).join(' ')
      
      // Suppress ENS-related errors and RPC timeouts
      if (
        message.includes('reverse') ||
        message.includes('getEnsName') ||
        message.includes('ContractFunctionExecutionError') ||
        message.includes('Internal error') ||
        message.includes('TimeoutError') ||
        message.includes('request took too long') ||
        allArgs.includes('0xc0497E381f536Be9ce14B0dD3817cBcAe57d2F62') || // ENS resolver address
        allArgs.includes('rpc.sepolia.org') // Public RPC endpoint
      ) {
        return // Silently ignore
      }
      originalError(...args)
    }
    
    return () => {
      console.error = originalError
    }
  }, [])

  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          chains={chains}
          showRecentTransactions={false}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  )
}
