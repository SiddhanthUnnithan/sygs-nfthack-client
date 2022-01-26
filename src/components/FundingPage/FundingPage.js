import React, { Component }from 'react';
import { isNil } from 'lodash';
import { ethers } from 'ethers';
import { 
    Container, 
    Card, CardBody, CardTitle, 
    Button,
    Form, FormInput, FormGroup,
    InputGroup,
    InputGroupAddon,
    InputGroupText
} from 'shards-react';
import { Spinner } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import {
    Elements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeConstantsManager from './stripeConstantsPrivate';
import CheckoutForm from './CheckoutForm';
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const stripeConstantsManager = new StripeConstantsManager();

class FundingPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentAccount: '',
            inputtedTokenSymbol: '',
            tokenSymbolValidated: false
        };
        // route: /funding/tokenSymbol
        //this.tokenSymbol = this.props.match.params.tokenSymbol;

        // public methods
        this.checkIfWalletIsConnected = this.checkIfWalletIsConnected.bind(this);
        this.connectWallet = this.connectWallet.bind(this);
        this.inputTokenSymbol = this.inputTokenSymbol.bind(this);
        
        // stripe initialization
        const stripeApiKey = stripeConstantsManager.getConstant('stripeTestKey');
        this.stripe = loadStripe(`${stripeApiKey}`);
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

    async inputTokenSymbol(event){
        event.preventDefault();

        try {
            // if valid contract address is returned then contribution may take place
            const requestData = {
                tokenSymbol: this.state.inputtedTokenSymbol,
            }

            const responseObject = await this.makeRequest('api/get_contract_address', 'POST', requestData);

            if (responseObject.status !== 200){ 
                alert('Invalid token!');
                return; 
            }

            const responseJson = responseObject.json;

            if (!isNil(responseJson.fundingContractAddress)) { this.setState({ tokenSymbolValidated: true }) };

            return;
        }  catch (err){
            console.log(err);
            return;
        }
    }

    // Helper Function
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

        return { json: jsonResponse, status: response.status };
    }

    render() {
        return (
            <div className='content-wrapper'>
                <Container>
                    <div>
                        <Card>
                            <CardBody>
                                {this.state.currentAccount === "" ? (
                                    <Button onClick={() => this.connectWallet()} className="cta-button connect-wallet-button">
                                        Connect to Wallet
                                    </Button>
                                ) : (
                                    <div>
                                        <Form onSubmit={this.inputTokenSymbol}>
                                            <FormGroup>
                                                <InputGroup size='md-2' seamless>
                                                    <InputGroupAddon type='prepend'>
                                                        <InputGroupText>
                                                            <FontAwesomeIcon icon={faSearch} />
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <FormInput onChange={ (e) => this.setState({ inputtedTokenSymbol:e.target.value }) } id="#inputtedTokenSymbol" />
                                                </InputGroup>
                                            </FormGroup>
                                            <Button block type="submit">Search Token Symbol</Button>
                                        </Form>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                        {(this.state.inputtedTokenSymbol === '' || !this.state.tokenSymbolValidated) ? (
                            <></>
                        ):
                        <Card>
                            <CardTitle>Contributing to { this.state.inputtedTokenSymbol } </CardTitle>
                            <CardBody>
                                <Elements stripe={this.stripe}>
                                    <CheckoutForm tokenSymbol={ this.state.inputtedTokenSymbol } props={this.props}/>
                                </Elements>
                            </CardBody>
                        </Card>
                        
                        }
                    </div>
                </Container>
            </div>
        )
    }
}

export default withRouter(FundingPage);