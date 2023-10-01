import React, { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import {CHAIN_ID} from "../constants";
import trimAddress from "../utils/address";
import { useEagerConnect, useInactiveListener } from "../utils/hooks";
import {injected} from "../utils/connector";
import {Provider} from "../utils/provider";



const ConnectButton = () => {
    const { activate, account, library, chainId, deactivate } = useWeb3React<Provider>();

    const [activating, setActivating] = useState(false);
    const [deactivating, setDeactivating] = useState(false);

    const handleActivate = () => {
        const _activate = async (activate:any) => {
            setActivating(true);
            await activate(injected);
            setActivating(false);
        }

        _activate(activate);
    }

    const handleDeactivate = () => {
        const _deactivate = async (deactivate:any) => {
            setDeactivating(true);
            try {
                deactivate();
            } catch (error) {
                console.log(error);
            }

            setDeactivating(false);
        }

        _deactivate(deactivate);
    }

    const eagerConnectionSuccessful = useEagerConnect();
    useInactiveListener(!eagerConnectionSuccessful);

    const switchNetwork = () => {
        if (library) {
            try {
                library.provider.request({
                    method: "wallet_switchEthereumChain",
                    params: [
                        {
                            chainId : `0x${CHAIN_ID.toString(16)}`
                        },
                    ],
                });
            }
            catch(error) {
                console.log(error);
            }
        }
    }

    if (chainId && chainId !== CHAIN_ID) {
        return <button className="btn btn-warning" onClick={switchNetwork} >Switch Network </button>
    }

    return account? <button className="btn btn-secondary" onClick={handleDeactivate}>{trimAddress(account)}</button> : <button className="btn btn-primary" onClick={handleActivate} >Connect wallet</button>

}

export default ConnectButton;