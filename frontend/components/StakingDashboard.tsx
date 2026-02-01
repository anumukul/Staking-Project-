'use client'

import { useAccount, useContractRead, useNetwork } from 'wagmi'
import { formatEther } from 'viem'
import { CONTRACT_ADDRESSES } from '@/contracts/addresses'
import { STAKING_ABI } from '@/contracts/abis/stakingABI'
import { ERC20_ABI } from '@/contracts/abis/erc20ABI'
import { StakeCard } from './StakeCard'
import { WithdrawCard } from './WithdrawCard'
import { ClaimRewardCard } from './ClaimRewardCard'
import { StatsCard } from './StatsCard'

export function StakingDashboard() {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()

  // Read staked balance
  const { data: stakedBalance } = useContractRead({
    address: CONTRACT_ADDRESSES.STAKING,
    abi: STAKING_ABI,
    functionName: 'stakedBalance',
    args: address ? [address] : undefined,
    enabled: !!address && !!chain,
    watch: true,
    onError: (error) => {
      console.debug('Staked balance read error:', error)
    },
  })

  // Read earned rewards
  const { data: earnedRewards } = useContractRead({
    address: CONTRACT_ADDRESSES.STAKING,
    abi: STAKING_ABI,
    functionName: 'earned',
    args: address ? [address] : undefined,
    enabled: !!address && !!chain,
    watch: true,
    onError: (error) => {
      console.debug('Earned rewards read error:', error)
    },
  })

  // Read stake token balance
  const { data: stakeTokenBalance } = useContractRead({
    address: CONTRACT_ADDRESSES.STAKE_TOKEN,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    enabled: !!address && !!chain,
    watch: true,
    onError: (error) => {
      console.debug('Stake token balance read error:', error)
    },
  })

  // Read allowance
  const { data: allowance } = useContractRead({
    address: CONTRACT_ADDRESSES.STAKE_TOKEN,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACT_ADDRESSES.STAKING] : undefined,
    enabled: !!address && !!chain,
    watch: true,
    refetchInterval: 3000, // Refetch every 3 seconds
    onError: (error) => {
      // Silently handle errors - contract might not exist on this network
      console.debug('Allowance read error:', error)
    },
  })

  // Read reward rate
  const { data: rewardRate } = useContractRead({
    address: CONTRACT_ADDRESSES.STAKING,
    abi: STAKING_ABI,
    functionName: 'REWARD_RATE',
    enabled: !!chain,
    onError: (error) => {
      // Silently handle errors - contract might not exist on this network
      console.debug('Reward rate read error:', error)
    },
  })

  const stakedBalanceFormatted = stakedBalance ? formatEther(stakedBalance) : '0'
  const earnedRewardsFormatted = earnedRewards ? formatEther(earnedRewards) : '0'
  const stakeTokenBalanceFormatted = stakeTokenBalance ? formatEther(stakeTokenBalance) : '0'
  const allowanceFormatted = allowance ? formatEther(allowance) : '0'

  // Show connect wallet message if not connected
  if (!isConnected) {
    return (
      <div className="text-center py-20">
        <div className="bg-gray-900 rounded-2xl p-12 max-w-md mx-auto border border-gray-800">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-semibold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-6">
            Please connect your wallet to start staking
          </p>
        </div>
      </div>
    )
  }

  // Check if contracts are accessible (basic check)
  const contractsAccessible = chain && (
    chain.id === 11155111 || // Sepolia (where contracts are deployed)
    chain.id === 1 || // Mainnet
    chain.id === 1337 || // Localhost
    chain.id === 31337 // Hardhat
  )

  return (
    <div className="space-y-8">
      {/* Network Warning */}
      {!contractsAccessible && (
        <div className="bg-yellow-900/50 border border-yellow-700 rounded-lg p-4">
          <p className="text-yellow-400 text-sm">
            ⚠️ Warning: Contracts may not be deployed on {chain?.name || 'this network'}. 
            Please switch to the network where your contracts are deployed.
          </p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Staked Balance"
          value={stakedBalanceFormatted}
          symbol="STK"
          gradient="from-blue-500 to-cyan-500"
        />
        <StatsCard
          title="Earned Rewards"
          value={earnedRewardsFormatted}
          symbol="RWT"
          gradient="from-purple-500 to-pink-500"
        />
        <StatsCard
          title="Wallet Balance"
          value={stakeTokenBalanceFormatted}
          symbol="STK"
          gradient="from-green-500 to-emerald-500"
        />
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StakeCard
          stakeTokenBalance={stakeTokenBalanceFormatted}
          allowance={allowanceFormatted}
        />
        <WithdrawCard stakedBalance={stakedBalanceFormatted} />
        <ClaimRewardCard earnedRewards={earnedRewardsFormatted} />
      </div>
    </div>
  )
}
