import React, { useState } from 'react';
import {
    CardElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import { isNil } from 'lodash';
import {
    Form,
    Button,
    Card, CardBody, CardTitle
} from 'shards-react';
import { ethers } from 'ethers';

function CheckoutForm({ tokenSymbol, props }){
    const [isPaymentLoading, setPaymentLoading] = useState(false);
    const [tokenId, setTokenId] = useState(undefined);
    const [contractAddress, setContractAddress] = useState(undefined);

    const stripe = useStripe();

    const elements = useElements();

    const makePayment = async(event) => {
        event.preventDefault();

        if (isNil(stripe) || isNil(elements)){
            console.log('Missing stripe components to render card UI.');
            return;
        }

        setPaymentLoading(true);

        const clientSecret = await getClientSecret();

        const paymentResult = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: 'Siddhanth Unnithan',
                },
            }
        });

        if (paymentResult.error){
            alert(paymentResult.error.message);
            return;
        }

        await sendRequestToMint();

        setPaymentLoading(false);
    }

    const sendRequestToMint = async() => {
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

            if (isNil(walletAddress)) { 
                console.log('Unable to get user wallet address.');
                return; 
            }

            // make minting request
            const requestData = {
                tokenSymbol: tokenSymbol,
                userAddress: walletAddress
            }

            const responseJson = await makeRequest('api/mint', 'POST', requestData);

            console.log(responseJson);
            
            if (isNil(responseJson) || !(responseJson.successfulMint) || isNil(responseJson.tokenId) || isNil(responseJson.contractAddress)){
                console.log('Invalid minting response.');
                return;
            }

            setTokenId(responseJson.tokenId);

            setContractAddress(responseJson.contractAddress);
        } catch (err) {
            console.log(err);
        }   
    }
    
    return (
        <div style={{ }}>
            <div style={{ maxWidth: '500px', margin: '0auto', }}>
                <Form onSubmit={makePayment}>
                    <div style={{display: 'flex', flexDirection: 'column' }}>
                        <CardElement className="card" options={{ style: { base: { backgroundColor: 'white' }} }} />
                        <Button className='pay-button' disabled={isPaymentLoading}>{isPaymentLoading ? 'Loading...' : 'Contribute to Funding Round'}</Button>
                    </div>
                </Form>
            </div>
            {(isNil(tokenId)) ? (
                            <></>
                        ): (
                            <Card className="contract-card">
                                <CardBody>
                                    <CardTitle>Token Minting Details</CardTitle>
                                    <p>View your minted token on Opensea:
                                        <a href={`https://testnets.opensea.io/assets/${contractAddress}/${tokenId}`}> https://testnets.opensea.io/assets/{contractAddress}/{tokenId}</a>
                                    </p>
                                    <p><b>Note: </b>Opensea may take a few minutes to show your token. Thank you for being patient!</p>
                                    <Button onClick={() => props.history.push(`/redeem/${tokenSymbol}`)}>Go to Redeem page</Button>
                                </CardBody>
                            </Card>
                        )}
        </div>
    )
}

async function getClientSecret(){
    // placeholder item
    const placeholderItem = [{ id: 'funding-payment' }];

    // create a payment intent
    const { clientSecret } = await makeRequest('create-payment-intent', 'POST', placeholderItem);

    console.log(clientSecret);

    return clientSecret;
}

async function makeRequest(path, method, data=undefined){
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

export default CheckoutForm;