import React, { useEffect, useState } from "react";
import { Buffer } from "buffer";
import { setupWalletSelector, WalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { SmartContracts } from './SmartContract';

import "@near-wallet-selector/modal-ui/styles.css";
global.Buffer = Buffer;

type LoginFormProps = {
    onAddressChanged?: () => void;
};

export const LoginForm: React.FC<LoginFormProps> = () => {
    const [signedIn, setSignedIn] = useState(false);
    const [userAddress, setUserAddress] = useState("");
    const [selector, setWalletSelector] = useState<WalletSelector | null>(null);
    
    const logOut = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const wallet = await selector?.wallet();
        wallet?.signOut();
        setSignedIn(false);
        setWalletSelector(null);
    }

    const logIn = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        await setSelector();
    }

    const setSelector = async() => {
        const walletSelector = await setupWalletSelector({
            network: "testnet",
            modules: [setupNearWallet()],
        });
        setWalletSelector(walletSelector);

        const isSignedIn = walletSelector.isSignedIn();
        setSignedIn(isSignedIn);

        if (isSignedIn) {
            const accountId = walletSelector.store.getState().accounts[0].accountId;
            setUserAddress(accountId);
        } else {
            const modal = setupModal(walletSelector, {
                contractId: "test.testnet",
            });
            modal.show();
        }
    }

    useEffect(() => {
        (async () => {
            await setSelector();
        })();
    }, []);

    return signedIn ? 
    (
        <Box>
            <Typography component="h1" variant="h5">
                Address: {userAddress}
            </Typography>
            <Button
                onClick={logOut} 
                fullWidth 
                variant="contained" 
                sx={{ mt: 3, mb: 2 }}
            >
                Logout
            </Button>
            <SmartContracts accountId={userAddress}/>
        </Box>
    ) : (
        <Box>
            <Typography component="h1" variant="h5">
                Please LOGIN
            </Typography>
            <Button
                onClick={logIn} 
                fullWidth 
                variant="contained" 
                sx={{ mt: 3, mb: 2 }}
            >
                Login
            </Button>
        </Box>
    );
};