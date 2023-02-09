import React, { useEffect, useState } from "react";
import { connect, keyStores, utils, Contract } from "near-api-js";
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

type SmartContractProps = {
    accountId: string;
};

type SmContract = Contract & {
    get?: () => [3];
    set?: (value:any) => void;
};

export const SmartContracts: React.FC<SmartContractProps> = ({accountId}) => {
    const [userBalance, setUserBalance] = useState("");
    const [rValue, setRValue] = useState("0");
    const [gValue, setGValue] = useState("0");
    const [bValue, setBValue] = useState("0");

    const getAccount = async() => {
        const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();
        const connectionConfig = {
            networkId: "testnet",
            keyStore: myKeyStore,
            nodeUrl: "https://rpc.testnet.near.org",
            walletUrl: "https://wallet.testnet.near.org",
            helperUrl: "https://helper.testnet.near.org",
            explorerUrl: "https://explorer.testnet.near.org",
        };
        const nearConnection = await connect(connectionConfig);
        const account = await nearConnection.account(accountId);

        return account;
    }

    const getBalance = async() => {
        const account = await getAccount();
        const balance = await account.getAccountBalance();
        setUserBalance(utils.format.formatNearAmount(balance.available));
    }

    const getContract = async () => {
        const account = await getAccount();
        const contract = new Contract(
            account,
            "frontend-test-4.badconfig.testnet",
            {
              viewMethods: ["get"],
              changeMethods: ["set"],
            }
        );
        return contract;
    }

    const getColors = async () => {
        const contract: SmContract = await getContract();
        const rgb = await contract?.get?.();
        const rgba = rgb === undefined ? [0,0,0] : rgb;
        document.documentElement.style.setProperty('--button-color', `rgb(${rgb})`);
        setRValue(rgba[0].toString());
        setGValue(rgba[1].toString());
        setBValue(rgba[2].toString());
    }

    const setColors = async () => {
        const walletSelector = await setupWalletSelector({
            network: "testnet",
            modules: [setupNearWallet()],
        });
        const wallet = await walletSelector.wallet();
        await wallet.signAndSendTransactions({
            transactions: [
              {
                receiverId: "frontend-test-4.badconfig.testnet",
                actions: [
                  {
                    type: "FunctionCall",
                    params: {
                      methodName: "set",
                      args: { r: +rValue, g: +gValue, b: +bValue },
                      gas: "30000000000000",
                      deposit: "0",
                    },
                  },
                ],
              },
            ],
          });
    }

    useEffect(() => {
        (async () => {
            await getBalance();
        })();
    });

    return (
        <Box>
            <Typography component="h1" variant="h5">
                Balance: {userBalance}
            </Typography>
            <Button
                className="color-button" 
                onClick={getColors} 
                fullWidth 
                variant="contained" 
                sx={{ mt: 3, mb: 2 }}
            >
                Get Colors
            </Button>
            <Grid container spacing={1}>
                <Grid item xs={4}>
                    <TextField onChange={(nv) => setRValue(nv.target.value)} value={rValue} label="R" variant="outlined" />
                </Grid>               
                <Grid item xs={4}>
                    <TextField onChange={(nv) => setGValue(nv.target.value)} value={gValue} label="G" variant="outlined" />
                </Grid>                
                <Grid item xs={4}>
                    <TextField onChange={(nv) => setBValue(nv.target.value)} value={bValue} label="B" variant="outlined" />
                </Grid>
            </Grid>
            <Button
                className="color-button" 
                onClick={setColors} 
                fullWidth 
                variant="contained" 
                sx={{ mt: 3, mb: 2 }}
            >
                Set Colors
            </Button>
        </Box>
    );
};