import React from 'react'
import { useContext, useEffect, useState } from 'react'

import Web3Context from '../../context/Web3Context'
import {ethers} from 'ethers'


const RewardRate = () => {

   const {stakingContract, selectedAccount}= useContext(Web3Context);

    const [rewardRate, setRewardRate]=useState("0");
    useEffect(()=>{
    
        const fetchRewardRate=async()=>{
    
            try{
    
                const rewardRateWei=await stakingContract.REWARD_RATE();
                const rewardRateEth=ethers.formatUnits(rewardRateWei.toString(), 18);

               
                setRewardRate(rewardRateEth);
                
               
    
    
            }
    
            catch(error){
    
                console.error("Error fetching data:", error.message);
    
            }
    
    
        }
    
        stakingContract && fetchRewardRate();
    
    
      },[stakingContract,selectedAccount])
    
    
    
      return (
        <div>Reward Rate: {rewardRate}token/second</div>
      )


  
}

export default RewardRate