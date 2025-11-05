import React from 'react'
import Web3Context from '../../context/Web3Context'
import { useContext } from 'react'

function ConnectedAccount() {

    const {selectedAccount}=useContext(Web3Context);
    console.log(selectedAccount);


  return (
   <p>connected account:{selectedAccount}</p>
  )
}

export default ConnectedAccount