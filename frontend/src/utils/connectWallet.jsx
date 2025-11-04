import {ethers,Contract} from "ethers"

import stakingAbi from "../ABI/stakingABI.json"
import stakingTokenAbi from "../ABI/stakingTokenABI.json"


export const connectWallet=async()=>{

    try{

        let [signer,provider,stakingContract,stakeTokenContract,chainId]=[null];
        if(window.ethereum==null){


            throw new Error("metamask is not installed");




        }

        const accounts=await window.ethereum.request({

            method:'eth_requestAccounts'
        })

        let chainIdHex=await window.ethereum.request({

            method:'eth_chainId'


        })    

        chainId=parseInt(chainIdHex,10);

        let selectedAccount=accounts[0];

        if(!selectedAccount){

            throw new Error("No ethereum accounts available");

        

        }


        provider=new ethers.BrowserProvider(window.ethereum);

        signer=await provider.getSigner();

        const stakingContractAddress="0x79123fc40E676D6af3dDFbd71782dbA14Dee84b7"
        const stakeTokenContractAddress="0x3D1c7bf2E01CEF0f787FeAF4bE68202Ea7d4dD60";

        stakingContract=new Contract(stakingContractAddress, stakingAbi, signer);

        stakeTokenContract=new Contract(stakeTokenContractAddress,stakingTokenAbi,signer);

        return {provider,selectedAccount,stakingContract,stakeTokenContract,chainId};











    }

    catch(error){

        console.log(error);
        throw error;



    }



}