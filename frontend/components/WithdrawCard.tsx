'use client'

import { useState } from 'react'
import { useContractWrite, useWaitForTransaction } from 'wagmi'
import { parseEther } from 'viem'
import { CONTRACT_ADDRESSES } from '@/contracts/addresses'
import { STAKING_ABI } from '@/contracts/abis/stakingABI'

interface WithdrawCardProps {
  stakedBalance: string
}

export function WithdrawCard({ stakedBalance }: WithdrawCardProps) {
  const [amount, setAmount] = useState('')

  const { write: withdraw, data: withdrawData, isLoading: isWithdrawPending } = useContractWrite({
    address: CONTRACT_ADDRESSES.STAKING,
    abi: STAKING_ABI,
    functionName: 'withdrawStakedTokens',
  })

  const { isLoading: isWithdrawConfirming } = useWaitForTransaction({
    hash: withdrawData?.hash,
    onSuccess: () => {
      setAmount('')
    },
  })

  const handleWithdraw = async () => {
    if (!amount) return

    try {
      const amountWei = parseEther(amount)
      withdraw({
        args: [amountWei],
      })
    } catch (error) {
      console.error('Withdraw error:', error)
    }
  }

  const handleMax = () => {
    setAmount(stakedBalance)
  }

  const isProcessing = isWithdrawPending || isWithdrawConfirming

  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
      <h2 className="text-xl font-semibold mb-4">Withdraw Tokens</h2>
      
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
            Staked: {parseFloat(stakedBalance).toLocaleString(undefined, { maximumFractionDigits: 4 })} STK
          </p>
        </div>

        <button
          onClick={handleWithdraw}
          disabled={!amount || isProcessing || parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(stakedBalance)}
          className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all"
        >
          {isProcessing ? 'Withdrawing...' : 'Withdraw'}
        </button>
      </div>
    </div>
  )
}
