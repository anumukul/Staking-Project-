import React from 'react'
import { useContext, useRef, useState } from 'react'

import Button from '../Common/Button'
import { ethers } from 'ethers';
import StakingContext from '../../context/StakingContext';

const WithdrawStakeAmount = () => {

    const {stakingContract}=useContext(Web3Context);
    const {isReload,setIsReload}=useContext(StakingContext);


    const withdrawStakeAmountRef=useRef();


    const [transactionStatus,setTransactionStatus]=useState("");




    const withdrawStakeToken=async(e)=>{

        e.preventDefault();
        const amount=withdrawStakeAmountRef.current.value.trim();
        if(isNaN(amount) || Number(amount)<=0){


            console.error("Please enter a valid positive number");
            return ;



        }

        const amountToWithdraw=ethers.parseUnits(amountToApprove,18).toString();
        console.log("Amount to approve in wei:", amountToSend);

        try{

            const transaction=await stakingContract.withdrawStakedTokens(amountToWithdraw);
            setTransactionStatus("Transaction is in pending state");
            setIsReload(!isReload);

            const receipt=await transaction.wait();
            if(receipt.status===1){


                setTransactionStatus("Transaction successful! Staking done.");

                setTimeout(()=>{


                    setTransactionStatus("");
                },5000

                )

                withdrawStakeAmountRef.current.value="";
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
  
      <form onSubmit={withdrawStakeToken}>
  
          <label>Amount to Withdraw:</label>
  
          <input type="text" ref={withdrawStakeAmountRef}></input>
          <Button onClick={withdrawStakeToken}  type="submit" label="Withdraw Staked Token"/>
  
  
  
      </form>
  
  
    </div>
}

export default StakeAmount;