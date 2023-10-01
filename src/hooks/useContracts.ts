import { useMemo } from "react";
import { Provider } from "../utils/provider";
import { getWETHContract } from "../utils/contracts";
import { useSigner } from "./useSigner";


export const useWETHContract = (library : Provider) => {
    const signer = useSigner(library);
    return useMemo(() => getWETHContract(signer), [signer]);
}