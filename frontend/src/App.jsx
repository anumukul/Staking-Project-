import { useState } from 'react'

import './App.css'
import Wallet from './components/Wallet/Wallet'
import Navigation from './components/Navigation/Navigation'
import DisplayPanel from './components/Display Panel/DisplayPanel'
import TokenApproval from './components/StakeToken/TokenApproval'
import StakeAmount from './components/StakeToken/StakeAmount'

import WithdrawStakeAmount from './components/Withdraw/Withdraw'

import { StakingProvider } from './context/StakingContext'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Wallet>
      <Navigation/>
      <StakingProvider>

        <DisplayPanel/>
      <StakeAmount/>
       <WithdrawStakeAmount/>


      </StakingProvider>
      
      <TokenApproval/>
     
      <ClaimReward/>
     </Wallet>

    </>
  )
}

export default App
