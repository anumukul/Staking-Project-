import { useState } from 'react'

import './App.css'
import Wallet from './components/Wallet/Wallet'
import Navigation from './components/Navigation/Navigation'
import DisplayPanel from './components/Display Panel/DisplayPanel'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Wallet>
      <Navigation/>
      <DisplayPanel/>
     </Wallet>
    </>
  )
}

export default App
