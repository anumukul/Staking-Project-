import React from 'react'

import {useState,useEffect} from 'react'

import { connectWallet } from '../../utils/connectWallet';
import Web3Context from '../../context/Web3Context';

import Button from '../Button/Button';
import { use } from 'react';

import { handleAccountChange} from '../../utils/handleAccountChange';
import { handleChainChange } from '../../utils/handleChainChange';

const Wallet = ({children}) => {

    const [state,setState]=useState({

        provider:null,
        selectedAccount:null,
        stakingContract:null,
        chainId:null,
    });

    const [isLoading,setIsLoading]=useState(false);

    useEffect(()=>{

        window.ethereum.on('accountsChanged',()=>handleAccountChange(setState));
         window.ethereum.on('chainChanged',()=>handleChainChange(setState));

         return()=>{

             window.ethereum.removeListener('accountsChanged',()=>handleAccountChange(setState));
         window.ethereum.removeListener('chainChanged',()=>handleChainChange(setState));


         }
    },[])




    const handleWallet=async()=>{

        try{

            setIsLoading(true);


            const { provider,
                selectedAccount,
        stakingContract,
        chainId,

            }=await connectWallet();

            console.log( provider,
                selectedAccount,
        stakingContract,
        chainId);


            setState({provider,
                selectedAccount,
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

    <div>

    <Web3Context.Provider value={state}>

        {children}

    
    </Web3Context.Provider>

    {isLoading && <p>Loading..</p>}
    <Button onClick={handleWallet} label="Connect Wallet" />

       

    </div>
  )
}

export default Wallet