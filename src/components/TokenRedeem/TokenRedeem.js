import React, { useEffect, useState }from 'react';
import { useParams } from 'react-router-dom';
import { isNil } from 'lodash';
import { ethers } from 'ethers';

function TokenRedeem() {
    // route: /funding/<tokensymbol>
    const { tokenSymbol } = useParams();
    const [currentAccount, setCurrentAccount] = useState("");
    const [tokenBalance, setTokenBalance] = useState(0);

    // main methods
    const checkIfWalletIsConnected = async () => {
        const { ethereum } = window;

        if (!ethereum){
            return <h2>Please install the metamask extension!</h2>;
        }
    }

    const connectWallet = async() => {
        try {
            const { ethereum } = window;

            if (!ethereum){
                alert('Install the metamask extension!');
                return;
            }

            // request access to account
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });

            setCurrentAccount(accounts[0]);
        } catch (err){
            console.log(err);
            return <h2>Unable to connect wallet!</h2>
        }
    }

    const redeemDiscountCode = async() => {
        try {
            const { ethereum } = window;

            if (isNil(ethereum)){
                console.log('Ethereum object does not exist.');
                return;
            }

            // get user wallet address
            const provider = new ethers.providers.Web3Provider(ethereum);

            const signer = provider.getSigner();

            const walletAddress = await signer.getAddress();

            // check whether token exists in user address
            const requestData = {
                tokenSymbol: tokenSymbol,
                userAddress: walletAddress
            }
            
            const responseJson = await makeRequest('api/check_token_existence', 'POST', requestData);

            if (!isNil(responseJson.tokenBalance)) { setTokenBalance(responseJson.tokenBalance); };
        } catch (err) {
            console.log(err);
        }
    }

     // helper methods
     const makeRequest = async(path, method, data=undefined) => {
        const requestUrl = `http://localhost:5678/${path}`;

        const requestOptions = {
            method: method,
            headers: {'Content-Type': 'application/json'}
        };

        if (!isNil(data)){
            requestOptions.body = JSON.stringify(data);
        }

        const response = await fetch(requestUrl, requestOptions);

        const jsonResponse = await response.json();

        return jsonResponse;
    }

    // render methods
    const renderNotConnectedContainer = () => (
        <button onClick={connectWallet} className="cta-button connect-wallet-button">
            Connect to Wallet
        </button>
    );

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <div>
            <div>
                <h2>Redeem Discount Code for { tokenSymbol }!</h2>
                {currentAccount === "" ? (
                    renderNotConnectedContainer()
                ) : (
                    <button onClick={redeemDiscountCode}>
                        Redeem Discount Code
                    </button>
                )}
            </div>
            <div>
                {tokenBalance === 0 ? (
                    <></>
                ) : (
                    <div>
                        <h4>Congratulations! Because you own {tokenSymbol} you're eligible to receive a discount code.</h4>
                        <h3>kha723hjkf02hhjk</h3>
                    </div>
                )}
            </div>
        </div>
        
    );
}

export default TokenRedeem;