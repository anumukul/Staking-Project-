import React from 'react'
import { useContext, useRef, useState } from 'react'

import Web3Context from '../../context/Web3Context'

import Button from '../Common/Button'
import { ethers } from 'ethers';

const TokenApproval = () => {

    const {stakeTokenContract,stakingContract}=useContext(Web3Context);


    const approvedTokenRef=useRef();


    const [transactionStatus,setTransactionStatus]=useState("");




    const approveToken=async(e)=>{

        e.preventDefault();
        const amountToApprove=approvedTokenRef.current.value.trim();
        if(isNaN(amountToApprove) || Number(amountToApprove)<=0){


            console.error("Please enter a valid positive number");
            return ;



        }

        const amountToSend=ethers.parseUnits(amountToApprove,18).toString();
        console.log("Amount to approve in wei:", amountToSend);

        try{

            const transaction=await stakeTokenContract.approve(stakingContract.target,amountToSend);
            setTransactionStatus("Transaction is in pending state");

            const receipt=await transaction.wait();
            if(receipt.status===1){


                setTransactionStatus("Transaction successful! Token approved.");

                setTimeout(()=>{


                    setTransactionStatus("");
                },5000

                )

                approveTokenRef.current.value="";
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

    <form onSubmit={approveToken}>

        <label>Token Aproval:</label>

        <input type="text" ref={approvedTokenRef}></input>
        <Button onClick={approveToken}  type="submit" label="Token Approve"/>



    </form>


  </div>
}

export default TokenApproval;