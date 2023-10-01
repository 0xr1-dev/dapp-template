import {Contract, ContractInterface, Signer} from "ethers";
import {contracts} from "../constants/contracts";
import {CHAIN_ID} from "../constants";
import erc20ABI from "../constants/abi/WETH.json";

const getContract = (abi : ContractInterface, address : string, signer : Signer) => {
    return new Contract(address, abi, signer);
}

export const getWETHContract = (signer : Signer) => {
    return getContract(erc20ABI, contracts.WETH[CHAIN_ID], signer);
}