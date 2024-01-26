import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";


export default function useCheckProfile(){
    const { chain } = useNetwork();
    const { chains, switchNetwork } = useSwitchNetwork();
    const { address } = useAccount();
    const [profile_data, setprofile_data] = useState([])
    const history= useNavigate()

    const getUserProfile=async()=>{
        if(address){
            if(chain?.id == chains[0]?.id){
                let res= await axios.get(`https://tron.betterlogics.tech/api/v1/get_By_id_Candidate?useraddress=${address}`)
                res=res.data
                if(res.success==true){
                    setprofile_data(res.data[0])
                }else{
                    setprofile_data([])
                    history('/myprofile')
                }

                console.log("res",res.data[0]);
            }
        }

    }

    return [profile_data,getUserProfile]

}