import React from 'react'
import { useContext, useRef, useState } from 'react'

import Button from '../Common/Button'
import { ethers } from 'ethers';

const ClaimReward = () => {

    const {stakingContract}=useContext(Web3Context);


    


    const [transactionStatus,setTransactionStatus]=useState("");




    const claimReward=async(e)=>{

        

        try{

            const transaction=await stakingContract.getReward();

            setTransactionStatus("Transaction is in pending state");

            const receipt=await transaction.wait();
            if(receipt.status===1){


                setTransactionStatus("Transaction successful!");

                setTimeout(()=>{


                    setTransactionStatus("");
                },5000

                )

                
            }

            else{



                setTransactionStatus("Transaction failed. Please try again.");
            }

            



        }

        catch(error){


            console.log("Reward claim failed:",error.message);
        }






    }
  return <div>
  
      {transactionStatus &&<div>{transactionStatus}</div>}
  
      
  
         
          <Button onClick={claimReward}  type="submit" label="Claim Reward"/>
  
  
  
    
  
  
    </div>
}

export default StakeAmount;