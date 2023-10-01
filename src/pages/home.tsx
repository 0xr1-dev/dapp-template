import { useWeb3React } from "@web3-react/core"
import ConnectButton from "../components/connect-button"
import { useSlowRefresh } from "../hooks/useRefresh";
import { useWETHContract } from "../hooks/useContracts";
import { useWETHStats } from "../hooks/weth";
import { ethers } from "ethers";

export const Home = () => {

    const { account, chainId, library } = useWeb3React();

    const refresh = useSlowRefresh();
    const wethContract = useWETHContract(library);

    const { balanceOf, decimals } = useWETHStats(library, account, refresh, chainId);


    return (
        <>
            <div className="container">
                <div className="row my-5">
                    <div className="col-12">
                        <ConnectButton />
                        {
                            account ?
                                (
                                    <>
                                        <p className="mt-5">WETH decimals : { decimals }</p>
                                        <p>Your WETH balance : {ethers.utils.formatEther(balanceOf)}</p>
                                    </>
                                )
                                :
                                (
                                    <p>Please connect your wallet</p>
                                )
                        }
                    </div>
                </div>
            </div>
        </>
    )

}