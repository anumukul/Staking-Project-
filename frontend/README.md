# Staking DApp Frontend

A modern Next.js frontend for the Staking smart contract, built with RainbowKit, Wagmi, and Viem.

## Features

- 🔗 Wallet connection with RainbowKit
- 📊 Real-time staking dashboard
- 💰 Stake tokens
- 📤 Withdraw staked tokens
- 🎁 Claim rewards
- 📱 Responsive design
- ⚡ Auto-refreshing data

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file with your API keys:
```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_INFURA_API_KEY=your_infura_api_key_here
```

You can get:
- Free Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com)
- Free API key from [Infura](https://infura.io) (recommended for better RPC reliability)

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Contract Addresses

The contract addresses are configured in `contracts/addresses.ts`. Make sure these match your deployed contracts:

- **Staking Contract**: `0xF8DfC4770C2D0cd0ce68D72cF290b8CF65E6e0A2`
- **Stake Token**: `0x839446C2Fc79593D1b29557b11bA2249fEB45f95`
- **Reward Token**: `0x074eE29d6D6604E23898f0B280048C275Ddd5D45`

## Build for Production

```bash
npm run build
npm start
```

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **RainbowKit** - Wallet connection UI
- **Wagmi** - React Hooks for Ethereum
- **Viem** - TypeScript Ethereum library
- **TanStack Query** - Data fetching and caching
