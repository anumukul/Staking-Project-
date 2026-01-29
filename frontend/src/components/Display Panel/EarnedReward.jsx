import React from 'react'
import { useContext, useEffect, useState } from 'react'

import Web3Context from '../../context/Web3Context'
import {ethers} from 'ethers'

const RewardRate = () => {

   const {stakingContract, selectedAccount}= useContext(Web3Context);
  


    const [rewardVal, setRewardVal]=useState("0");
    useEffect(()=>{
    
        const fetchRewardInfo=async()=>{    
    
            try{
    
                const rewardValWei=await stakingContract.earned(selectedAccount);
                const rewardValEth=ethers.formatUnits(rewardValWei,18).toString();
                const roundedRewardVal=parseFloat(rewardValEth).toFixed(2);


               
                setRewardVal(roundedRewardVal);
                
                
               
    
    
            }
    
            catch(error){
    
                console.error("Error fetching data:", error.message);
    
            }

            }

              const interval=setInterval(()=>{

            stakingContract && fetchRewardInfo();

            




        },20000);

           
      return ()=>clearInterval(interval);

    
    
        

      


    
     
    
      },[stakingContract,selectedAccount])
    
    
    
      return (
        <div>Reward Rate: {rewardVal}token/second</div>
      )


  
}

export default RewardRate