import React, { useEffect, useState }from 'react';
import { useParams } from 'react-router-dom';
import { isNil } from 'lodash';
import { ethers } from 'ethers';
import { Container, Card, CardBody, CardTitle, Button } from 'shards-react';

function FundingPage() {
    // route: /funding/<tokensymbol>
    const { tokenSymbol } = useParams();
    const [currentAccount, setCurrentAccount] = useState("");

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

    const sendRequestToMint = async () => {
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

            // make minting request
            const requestData = {
                tokenSymbol: tokenSymbol,
                userAddress: walletAddress
            }

            const responseJson = await makeRequest('api/mint', 'POST', requestData);

            console.log(responseJson);
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
        <Button onClick={connectWallet} className="cta-button connect-wallet-button">
            Connect to Wallet
        </Button>
    );

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <div className='content-wrapper'>
            <Container>
                <Card className="contract-card">
                <CardBody>
                    <CardTitle>Contribute to { tokenSymbol }!</CardTitle>
                    {currentAccount === "" ? (
                        renderNotConnectedContainer()
                    ) : (
                        <Button onClick={sendRequestToMint}>
                            Contribute Funding Amount
                        </Button>
                    )}
                </CardBody>
            </Card>
            </Container>
        </div>    
    );
}

export default FundingPage;