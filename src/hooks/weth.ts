import { BigNumber, Contract } from "ethers";
import { contracts } from "../constants/contracts";
import { useEffect, useState } from "react";
import { CHAIN_ID } from "../constants";
import { MultiCall } from "@indexed-finance/multicall";
import WETHabi from "../constants/abi/WETH.json";

export const useWETHStats = (library: any, account: any, refresh: any, chainId: number) => {

    const [stats, setStats] = useState({
        decimals: BigNumber.from(0),
        balanceOf: BigNumber.from(0),
    });

    useEffect(() => {
        const fetch = async () => {
            const multicall = new MultiCall(library);
            try {
                const calls = [
                    {
                        target: contracts.WETH[CHAIN_ID],
                        function: 'decimals',
                        args: []
                    },
                    {
                        target: contracts.WETH[CHAIN_ID],
                        function: 'balanceOf',
                        args: [account]
                    }
                ]

                const [, res] = await multicall.multiCall(WETHabi, calls);

                setStats({
                    decimals: res[0],
                    balanceOf: res[1],
                })

            }
            catch (e) {
                console.log(e);
            }
        }
        if (account && library && (CHAIN_ID === chainId)) {
            fetch();
        }
    }, [library, account, chainId, refresh])

    return stats;
}


export const approveSpender = async (wethContract: Contract, spender: string, amount: BigNumber) => {
    if (wethContract.signer) {
        try {
            const tx = await wethContract.approve(spender, amount);
            return await tx.wait();
        }
        catch (e) {
            console.log(e);
            return false
        }
    }
    else {
        return false;
    }
}

export const wrapETH = async (wethContract: Contract, amount: BigNumber) => {
    if (wethContract.signer) {
        try {
            const tx = await wethContract.deposit({ value: amount });
            return await tx.wait();
        }
        catch (e) {
            console.log(e);
            return false
        }
    }
    else {
        return false;
    }
}