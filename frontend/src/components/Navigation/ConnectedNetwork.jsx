import React, { useContext } from 'react'
import Web3Context from '../../context/Web3Context'

function ConnectedNetwork() {

    const {chainId}=useContext(Web3Context);

    if(chainId===11155111){

        return (

            <p>Connected Network: sepolia</p>
        )
    }
    else{

         return (
    <p>Connected Network:Unsupported</p>
  )



    }


 
}

export default ConnectedNetwork