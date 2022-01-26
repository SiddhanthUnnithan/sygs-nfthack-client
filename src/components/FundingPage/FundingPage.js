import React, { Component }from 'react';
import { isNil } from 'lodash';
import { ethers } from 'ethers';
import { 
    Container, 
    Card, CardBody, CardTitle, 
    Button,
    //Form, FormInput, FormGroup
} from 'shards-react';
import { Spinner } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import {
    Elements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeConstantsManager from './stripeConstantsPrivate';
import CheckoutForm from './CheckoutForm';

const stripeConstantsManager = new StripeConstantsManager();

class FundingPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentAccount: '',
        };
        // route: /funding/tokenSymbol
        this.tokenSymbol = this.props.match.params.tokenSymbol;

        // public methods
        this.checkIfWalletIsConnected = this.checkIfWalletIsConnected.bind(this);
        this.connectWallet = this.connectWallet.bind(this);
        
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

    render() {
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
                                    <Elements stripe={this.stripe}>
                                        <CheckoutForm tokenSymbol={this.props.match.params.tokenSymbol} props={this.props}/>
                                    </Elements>
                                )}
                            </CardBody>
                        </Card>
                    </div>
                </Container>
            </div>
        )
    }
}

export default withRouter(FundingPage);