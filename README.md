# Staking Platform

A decentralized staking platform that allows users to stake ERC20 tokens and earn rewards. The platform consists of smart contracts deployed on Ethereum Sepolia testnet and a modern web frontend built with Next.js.

## Overview

This project implements a complete staking mechanism where users can:
- Stake their tokens to earn rewards over time
- Withdraw staked tokens at any time
- Claim accumulated rewards
- View real-time staking statistics

The reward system uses a continuous distribution model where rewards are calculated based on the amount staked and time elapsed, distributed proportionally among all stakers.

## Features

### Smart Contracts
- ERC20 token contracts for staking and rewards
- Secure staking contract with reentrancy protection
- Automatic reward calculation and distribution
- Real-time reward accrual based on staked amount

### Frontend
- Modern React-based user interface
- Wallet connection via RainbowKit
- Real-time balance and reward tracking
- Transaction status monitoring
- Responsive design for all devices

## Project Structure

```
Staking-Project/
├── contracts/              # Solidity smart contracts
│   ├── StakeToken.sol      # ERC20 token for staking
│   ├── RewardToken.sol     # ERC20 token for rewards
│   └── Staking.sol         # Main staking contract
└── frontend/               # Next.js frontend application
    ├── app/                # Next.js app directory
    ├── components/         # React components
    ├── contracts/          # Contract ABIs and addresses
    └── package.json        # Frontend dependencies
```

## Smart Contracts

### StakeToken (STK)
Standard ERC20 token that users stake to earn rewards. The contract mints tokens to the deployer upon deployment.

**Deployment Parameters:**
- `initialSupply`: Total number of tokens to mint (e.g., 1000000)

### RewardToken (RWT)
Standard ERC20 token distributed as rewards to stakers. The contract mints tokens to the deployer upon deployment.

**Deployment Parameters:**
- `initialSupply`: Total number of tokens to mint (e.g., 10000000)

**Important:** After deployment, transfer all RWT tokens to the Staking contract address to enable reward distribution.

### Staking Contract
Main contract that manages staking operations and reward distribution.

**Key Features:**
- Stake tokens to start earning rewards
- Withdraw staked tokens at any time
- Claim accumulated rewards
- Real-time reward calculation

**Deployment Parameters:**
- `stakingToken`: Address of the StakeToken contract
- `rewardToken`: Address of the RewardToken contract

**Reward Rate:** 1e18 tokens per second (configurable constant)

## Frontend Setup

### Prerequisites
- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- Access to Ethereum Sepolia testnet

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_INFURA_API_KEY=your_infura_api_key
```

4. Update contract addresses in `frontend/contracts/addresses.ts` with your deployed contract addresses.

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: Get from [WalletConnect Cloud](https://cloud.walletconnect.com)
- `NEXT_PUBLIC_INFURA_API_KEY`: Get from [Infura](https://infura.io) for reliable RPC access

## Deployment

### Smart Contracts

1. Deploy contracts in the following order:
   - StakeToken with desired initial supply
   - RewardToken with desired initial supply
   - Staking contract with addresses of the two token contracts

2. Transfer all RewardToken supply to the Staking contract address.

3. Update contract addresses in the frontend configuration.

### Frontend

Build for production:
```bash
cd frontend
npm run build
npm start
```

## Usage Guide

### For Users

1. **Connect Wallet**: Click the "Connect Wallet" button and approve the connection.

2. **Stake Tokens**:
   - Enter the amount of STK tokens you want to stake
   - Click "Approve STK (Max)" if this is your first time (approves maximum amount)
   - After approval, click "Stake" and confirm the transaction

3. **View Rewards**: Your earned rewards are displayed in real-time and update automatically.

4. **Claim Rewards**: Click "Claim Rewards" to transfer your accumulated RWT tokens to your wallet.

5. **Withdraw Tokens**: Enter the amount to withdraw and click "Withdraw" to retrieve your staked STK tokens.

### For Developers

The frontend uses Wagmi hooks for contract interactions:
- `useContractRead` for reading contract state
- `useContractWrite` for executing transactions
- `useWaitForTransaction` for monitoring transaction status

Contract ABIs are located in `frontend/contracts/abis/` and contract addresses in `frontend/contracts/addresses.ts`.

## Technical Details

### Reward Calculation

Rewards are calculated using a reward-per-token model:
- Rewards accrue continuously based on time and total staked amount
- Each user's reward is proportional to their staked balance
- Rewards are updated automatically on stake, withdraw, and claim operations

### Security Features

- ReentrancyGuard protection on all state-changing functions
- Zero address validation in constructor
- Balance checks before token transfers
- Input validation for all user inputs

### Network Configuration

The application is configured for Ethereum Sepolia testnet. To use a different network:
1. Update the chain configuration in `frontend/app/providers.tsx`
2. Deploy contracts to the target network
3. Update contract addresses in `frontend/contracts/addresses.ts`

## Contract Addresses (Sepolia)

- Staking Contract: `0xF8DfC4770C2D0cd0ce68D72cF290b8CF65E6e0A2`
- StakeToken: `0x839446C2Fc79593D1b29557b11bA2249fEB45f95`
- RewardToken: `0x074eE29d6D6604E23898f0B280048C275Ddd5D45`

## Dependencies

### Smart Contracts
- OpenZeppelin Contracts (ERC20, ReentrancyGuard)

### Frontend
- Next.js 14
- React 18
- Wagmi v1
- Viem
- RainbowKit
- Tailwind CSS
- TypeScript

## Development

### Running Tests

Smart contracts can be tested using Hardhat or Foundry. Frontend components can be tested using React Testing Library.

### Code Style

- Solidity: Follow Solidity Style Guide
- TypeScript: ESLint configuration included
- React: Functional components with hooks

## License

This project uses the following licenses:
- Smart Contracts: GPL-3.0
- Token Contracts: MIT
- Frontend: See package.json

## Contributing

When contributing to this project:
1. Follow existing code style
2. Add tests for new features
3. Update documentation as needed
4. Ensure all contracts are properly tested before deployment

## Support

For issues or questions:
1. Check the console for error messages
2. Verify you're on the correct network (Sepolia)
3. Ensure contract addresses are correctly configured
4. Verify you have sufficient gas tokens (ETH) for transactions

## Notes

- The current reward rate (1e18) is set very high for demonstration purposes. Adjust according to your tokenomics.
- Ensure the Staking contract has sufficient RewardToken balance to pay rewards.
- Monitor the contract's reward token balance and refill as needed.
