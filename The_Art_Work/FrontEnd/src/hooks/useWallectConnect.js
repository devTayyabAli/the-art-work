import React from 'react'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { useWeb3Modal } from "@web3modal/wagmi/react";
import axios from 'axios';
import useCheckProfile from './useCheckProfile';


export default function useWallectConnect() {
    const { chain } = useNetwork();
    const { chains, switchNetwork } = useSwitchNetwork();
    const { address } = useAccount();
    const { open } = useWeb3Modal();
    const [profile_data, getUserProfile] = useCheckProfile()


    const connectWallect = async () => {
        try {
            if (address) {
                if (chain?.id == chains[0]?.id) {
                    open()
                } else {
                    switchNetwork?.(chains[0]?.id)
                }
            } else {
                await open()
                getUserProfile()
            }
        } catch (error) {
            console.log(error);
        }

    }

    return [connectWallect]

}