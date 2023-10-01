import { Signer } from "ethers";
import { useEffect, useState } from "react";

export const useSigner = (library : any) => {
    const [signer, setSigner] = useState<Signer>();
    useEffect(() => {
        if (library) {
            setSigner(library.getSigner());
        } else {
            setSigner(undefined);
        }
    }, [library]);

    return signer;
}