import React from 'react'
import ConnectedAccount from './connectedAccount'
import ConnectedNetwork from './connectedNetwork'

function Navigation() {
  return (
    <nav>
        <ConnectedAccount/>
        <ConnectedNetwork/>
    </nav>
  )
}

export default Navigation