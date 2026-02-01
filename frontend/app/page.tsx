'use client'

import { useEffect, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { StakingDashboard } from '@/components/StakingDashboard'

export default function Home() {
  const { isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Staking Platform
              </h1>
              <p className="text-gray-400">Stake your tokens and earn rewards</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Staking Platform
            </h1>
            <p className="text-gray-400">Stake your tokens and earn rewards</p>
          </div>
          <ConnectButton />
        </div>

        {/* Main Content */}
        <StakingDashboard />
      </div>
    </main>
  )
}
