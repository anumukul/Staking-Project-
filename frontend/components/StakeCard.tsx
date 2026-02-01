'use client'

import { useState } from 'react'
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi'
import { parseEther, maxUint256 } from 'viem'
import { CONTRACT_ADDRESSES } from '@/contracts/addresses'
import { STAKING_ABI } from '@/contracts/abis/stakingABI'
import { ERC20_ABI } from '@/contracts/abis/erc20ABI'

interface StakeCardProps {
  stakeTokenBalance: string
  allowance: string
}

export function StakeCard({ stakeTokenBalance, allowance }: StakeCardProps) {
  const { address } = useAccount()
  const [amount, setAmount] = useState('')

  const { write: approve, data: approveData, isLoading: isApprovePending, error: approveError } = useContractWrite({
    address: CONTRACT_ADDRESSES.STAKE_TOKEN,
    abi: ERC20_ABI,
    functionName: 'approve',
    onError: (error) => {
      console.error('Approve error:', error)
    },
  })

  const { write: stake, data: stakeData, isLoading: isStakePending, error: stakeError } = useContractWrite({
    address: CONTRACT_ADDRESSES.STAKING,
    abi: STAKING_ABI,
    functionName: 'stake',
    onError: (error) => {
      console.error('Stake error:', error)
    },
  })

  const { isLoading: isApproveConfirming, isError: isApproveError } = useWaitForTransaction({
    hash: approveData?.hash,
    onSuccess: () => {
      // Allowance will be refetched automatically via refetchInterval in StakingDashboard
    },
    onError: (error) => {
      console.error('Approve transaction error:', error)
    },
  })

  const { isLoading: isStakeConfirming, isError: isStakeError } = useWaitForTransaction({
    hash: stakeData?.hash,
    onSuccess: () => {
      setAmount('')
    },
    onError: (error) => {
      console.error('Stake transaction error:', error)
    },
  })

  const handleApprove = async () => {
    if (!address) return
    
    try {
      // Approve max amount so user doesn't need to approve again
      approve({
        args: [CONTRACT_ADDRESSES.STAKING, maxUint256],
      })
    } catch (error) {
      console.error('Approve error:', error)
    }
  }

  const handleStake = async () => {
    if (!amount) return

    try {
      const amountWei = parseEther(amount)
      stake({
        args: [amountWei],
      })
    } catch (error) {
      console.error('Stake error:', error)
    }
  }

  const handleMax = () => {
    setAmount(stakeTokenBalance)
  }

  // Check if allowance is sufficient (with small buffer for precision)
  const allowanceNum = parseFloat(allowance) || 0
  const amountNum = parseFloat(amount) || 0
  const needsApproval = amountNum > 0 && allowanceNum < amountNum * 1.01 // Small buffer for rounding
  
  const isProcessing = isApprovePending || isApproveConfirming || isStakePending || isStakeConfirming

  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
      <h2 className="text-xl font-semibold mb-4">Stake Tokens</h2>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-gray-400">Amount</label>
            <button
              onClick={handleMax}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Max
            </button>
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isProcessing}
          />
          <p className="text-xs text-gray-500 mt-1">
            Balance: {parseFloat(stakeTokenBalance).toLocaleString(undefined, { maximumFractionDigits: 4 })} STK
          </p>
        </div>

        {/* Error Messages */}
        {(approveError || isApproveError) && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-3">
            <p className="text-red-400 text-sm">
              ❌ Approval failed: {approveError?.message || 'Transaction failed'}
            </p>
          </div>
        )}
        {(stakeError || isStakeError) && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-3">
            <p className="text-red-400 text-sm">
              ❌ Staking failed: {stakeError?.message || 'Transaction failed'}
            </p>
          </div>
        )}

        {needsApproval ? (
          <div className="space-y-2">
            <p className="text-xs text-yellow-400 text-center">
              ⚠️ Approval required before staking
            </p>
            <button
              onClick={handleApprove}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {isApprovePending || isApproveConfirming ? 'Approving...' : 'Approve STK (Max)'}
            </button>
          </div>
        ) : (
          <button
            onClick={handleStake}
            disabled={!amount || isProcessing || parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(stakeTokenBalance)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all"
          >
            {isStakePending || isStakeConfirming ? 'Staking...' : 'Stake'}
          </button>
        )}
      </div>
    </div>
  )
}
