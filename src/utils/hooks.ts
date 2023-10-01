import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState } from 'react';
import {injected} from "./connector";
import { Provider } from './provider';

export function useEagerConnect(): boolean {
    const { activate, active } = useWeb3React<Provider>();

    const [tried, setTried] = useState<boolean>(false);

    const tryActivate = useCallback((): void => {
        async function _tryActivate() {
            const isAuthorized = await injected.isAuthorized();

            if (isAuthorized) {
                try {
                    await activate(injected, undefined, true);
                } catch (error: any) {
                    console.log(error);
                }
            }

            setTried(true);
        }

        _tryActivate();
    }, [activate]);

    useEffect((): void => {
        tryActivate();
    }, [tryActivate]);

    useEffect((): void => {
        if (!tried && active) {
            setTried(true);
        }
    }, [tried, active]);

    return tried;
}

export function useInactiveListener(suppress: boolean = false): void {
    const { active, error, activate, chainId } = useWeb3React<Provider>();

    useEffect((): (() => void) | undefined => {
        const { ethereum } = window as any;

        if (ethereum && ethereum.on && !active && !error && !suppress) {
            const handleConnect = async ()  => {
                activate(injected);
            };

            const handleChainChanged = (chainId: string | number): void => {
                activate(injected);
            };

            const handleAccountsChanged = (accounts: string[]): void => {
                if (accounts.length > 0) {
                    activate(injected);
                }
            };

            ethereum.on('connect', handleConnect);
            ethereum.on('chainChanged', handleChainChanged);
            ethereum.on('accountsChanged', handleAccountsChanged);

            return (): void => {
                if (ethereum.removeListener) {
                    ethereum.removeListener('connect', handleConnect);
                    ethereum.removeListener('chainChanged', handleChainChanged);
                    ethereum.removeListener('accountsChanged', handleAccountsChanged);
                }
            };
        }
    }, [active, error, suppress, activate]);
}