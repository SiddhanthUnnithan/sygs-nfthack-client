import React, { Component }from 'react';
import { isNil } from 'lodash';
import { ethers } from 'ethers';
import { Container, Card, CardBody, CardTitle, Button } from 'shards-react';
import { Spinner } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

class FundingPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentAccount: '',
            mintingToken: false,
            tokenId: undefined,
            userWalletAddress: undefined,
            contractAddress: undefined
        };
        // route: /funding/tokenSymbol
        this.tokenSymbol = this.props.match.params.tokenSymbol;

        // public methods
        this.checkIfWalletIsConnected = this.checkIfWalletIsConnected.bind(this);
        this.connectWallet = this.connectWallet.bind(this);
        this.sendRequestToMint = this.sendRequestToMint.bind(this);
    }

    // public methods
    async checkIfWalletIsConnected() {
        const { ethereum } = window;

        if (!ethereum){
            return <h2>Please install the metamask extension!</h2>;
        }   
    }

    async connectWallet() {
        try {
            const { ethereum } = window;

            if (!ethereum){
                alert('Install the metamask extension!');
                return;
            }

            // request access to account
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });

            this.setState({ currentAccount: accounts[0] });

        } catch (err){
            console.log(err);
            return <h2>Unable to connect wallet!</h2>
        }
    }

    async sendRequestToMint(event){
        event.preventDefault();
        
        try {
            const { ethereum } = window;

            if (isNil(ethereum)){
                console.log('Ethereum object does not exist.');
                return;
            }

            this.setState({ mintingToken: true });

            // get user wallet address
            const provider = new ethers.providers.Web3Provider(ethereum);

            const signer = provider.getSigner();

            const walletAddress = await signer.getAddress();

            if (isNil(walletAddress)) { 
                console.log('Unable to get user wallet address.');
                return; 
            }
            
            this.setState({ userWalletAddress: walletAddress });

            // make minting request
            const requestData = {
                tokenSymbol: this.tokenSymbol,
                userAddress: walletAddress
            }

            const responseJson = await this.makeRequest('api/mint', 'POST', requestData);

            console.log(responseJson.tokenId);
            
            if (isNil(responseJson) || !(responseJson.successfulMint) || isNil(responseJson.tokenId) || isNil(responseJson.contractAddress)){
                console.log('Invalid minting response.');
                return;
            }

            this.setState({ tokenId: responseJson.tokenId });

            this.setState({ contractAddress: responseJson.contractAddress });

            this.setState({ mintingToken: false });
        } catch (err) {
            console.log(err);
        }
    }

    async makeRequest(path, method, data=undefined) {
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

    nextPath(path) {
        this.props.history.push(path);
    }

    render() {
        let contributionButtonText = 'Contribute Funding Amount';
        let loadingText = '';

        if (this.state.mintingToken){
            contributionButtonText =  <Spinner animation="border" variant="light"></Spinner>;
            loadingText = <h6 padding='5px'>Congratulations on contributing! Your token is being minted. Thank you for your patience!</h6>;
        }

        return (
            <div className='content-wrapper'>
                <Container>
                    <div>
                        <Card>
                            <CardBody>
                                <CardTitle>Contributing to { this.props.match.params.tokenSymbol }!</CardTitle>
                                {this.state.currentAccount === "" ? (
                                    <Button onClick={() => this.connectWallet()} className="cta-button connect-wallet-button">
                                        Connect to Wallet
                                    </Button>
                                ) : (
                                    <div>
                                        <Button onClick={this.sendRequestToMint}>
                                            {contributionButtonText}
                                        </Button>
                                        <br/>
                                        {loadingText}
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                        {(isNil(this.state.tokenId)) ? (
                            <></>
                        ): (
                            <Card className="contract-card">
                                <CardBody>
                                    <CardTitle>Token Minting Details</CardTitle>
                                    <p>View your minted token on Opensea:
                                        <a href={`https://testnets.opensea.io/assets/${this.state.contractAddress}/${this.state.tokenId}`}>https://testnets.opensea.io/assets/${this.state.contractAddress}/${this.state.tokenId}</a>
                                    </p>
                                    <p><b>Note: </b>Opensea may take a few minutes to show your token. Thank you for being patient!</p>
                                    <Button onClick={() => this.nextPath(`/redeem/${this.state.tokenSymbol}`)}>Go to Redeem page</Button>
                                </CardBody>
                            </Card>
                        )}
                    </div>
                </Container>
            </div>
        )
    }
}

export default withRouter(FundingPage);