import React from 'react'

import {useState,useEffect} from 'react'

import { connectWallet } from '../../utils/connectWallet';

const Wallet = () => {

    const [state,setState]=useState({

        provider:null,
        account:null,
        stakingContract:null,
        chainId:null,
    });

    const [isLoading,setIsLoading]=useState(false);


    const handleWallet=async()=>{

        try{

            setIsLoading(true);


            const { provider,
                account,
        stakingContract,
        chainId,

            }=await connectWallet()

            setState({provider,
                account,
        stakingContract,
        chainId,})


        }

        catch(error){

            console.error("Error connecting wallet:",error.message);



        }finally{

            setIsLoading(false);

        }
    }


  return (
    <div>Wallet</div>
  )
}

export default Wallet