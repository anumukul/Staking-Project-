'use client'

import { useContractWrite, useWaitForTransaction } from 'wagmi'
import { CONTRACT_ADDRESSES } from '@/contracts/addresses'
import { STAKING_ABI } from '@/contracts/abis/stakingABI'

interface ClaimRewardCardProps {
  earnedRewards: string
}

export function ClaimRewardCard({ earnedRewards }: ClaimRewardCardProps) {
  const { write: claimReward, data: claimData, isLoading: isClaimPending } = useContractWrite({
    address: CONTRACT_ADDRESSES.STAKING,
    abi: STAKING_ABI,
    functionName: 'getReward',
  })

  const { isLoading: isClaimConfirming } = useWaitForTransaction({
    hash: claimData?.hash,
  })

  const handleClaim = async () => {
    try {
      claimReward()
    } catch (error) {
      console.error('Claim error:', error)
    }
  }

  const isProcessing = isClaimPending || isClaimConfirming
  const hasRewards = parseFloat(earnedRewards) > 0

  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
      <h2 className="text-xl font-semibold mb-4">Claim Rewards</h2>
      
      <div className="space-y-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Available Rewards</p>
          <p className="text-2xl font-bold text-purple-400">
            {parseFloat(earnedRewards).toLocaleString(undefined, {
              maximumFractionDigits: 4,
            })}{' '}
            <span className="text-lg text-gray-500">RWT</span>
          </p>
        </div>

        <button
          onClick={handleClaim}
          disabled={!hasRewards || isProcessing}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all"
        >
          {isProcessing ? 'Claiming...' : 'Claim Rewards'}
        </button>
      </div>
    </div>
  )
}
