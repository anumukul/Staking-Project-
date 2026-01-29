import React from 'react'
import { useContext, useRef, useState } from 'react'

import Button from '../Common/Button'
import { ethers } from 'ethers';
import StakingContext from '../../context/StakingContext';

const StakeAmount = () => {

    const {stakingContract}=useContext(Web3Context);

    const {isReload,setIsReload}=useContext(StakingContext);


    const stakeAmountRef=useRef();


    const [transactionStatus,setTransactionStatus]=useState("");




    const stakeToken=async(e)=>{

        e.preventDefault();
        const amount=stakeAmountRef.current.value.trim();
        if(isNaN(amount) || Number(amount)<=0){


            console.error("Please enter a valid positive number");
            return ;



        }

        const amountToStake=ethers.parseUnits(amount,18).toString();
        console.log("Amount to approve in wei:", amountToStake);

        try{

            const transaction=await stakingContract.stake(amountToStake)
            setTransactionStatus("Transaction is in pending state");

            const receipt=await transaction.wait();
            if(receipt.status===1){


                setTransactionStatus("Transaction successful! Staking done.");
                setIsReload(!isReload);

                setTimeout(()=>{


                    setTransactionStatus("");
                },5000

                )

                stakeAmountRef.current.value="";
            }

            else{



                setTransactionStatus("Transaction failed. Please try again.");
            }

            



        }

        catch(error){


            console.log("Token approval failed:",error.message);
        }






    }
  return <div>
  
      {transactionStatus &&<div>{transactionStatus}</div>}
  
      <form onSubmit={stakeToken}>
  
          <label>Amount to stake:</label>
  
          <input type="text" ref={stakeAmountRef}></input>
          <Button onClick={stakeToken}  type="submit" label="Stake"/>
  
  
  
      </form>
  
  
    </div>
}

export default StakeAmount;