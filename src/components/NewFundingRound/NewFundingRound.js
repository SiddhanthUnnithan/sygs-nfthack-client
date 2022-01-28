import React, {Component} from 'react';
import { isNil } from 'lodash';
import {
    Alert, Container,
    Form, FormInput, FormGroup, Button,
    Card, CardBody, CardTitle, Tooltip
} from "shards-react";
import { Spinner } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { InfoCircleFill } from 'react-bootstrap-icons';

class NewFundingRound extends Component {

    constructor(props) {
        super(props);
        // state variables
        this.state = {
            businessName: "",
            fundingAmount: 0,
            fundingPurpose: "",
            donationSize: 0,
            contractAddress: "",
            tokenSymbol: "",
            loadingContract: false,
            toolTip: {
                businessNameTip: false,
                fundingAmountTip: false,
                fundingPurposeTip: false,
                donationSizeTip: false,
            },
            errorMessage: "",
            error: false,
        };

        // public methods
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.makeRequest = this.makeRequest.bind(this);
        this.validationCheck = this.validationCheck.bind(this);
        this.dismissValidationAlert = this.dismissValidationAlert.bind(this);
    }

    validationCheck() {
        let errorMessage = "";
        if (this.state.fundingAmount <= 0) {
            errorMessage = " funding amount,";
        }

        if (this.state.donationSize <= 0) {
            errorMessage = errorMessage.concat(" donation size");
        }

        if (errorMessage.length > 0) {
            let initialErrorMessage = 'The following quantities cannot be less than or equal to 0:'
            this.setState({errorMessage: initialErrorMessage.concat(errorMessage), error: true});
            return false;
        }
        return true;
    }

    async handleSubmit(event) {
        event.preventDefault();

        if (!this.validationCheck()) {
            return;
        }
        
        try {
            const desiredTokenIssue = Math.round(this.state.fundingAmount / this.state.donationSize);
            
            const requestData = {
                businessName: this.state.businessName,
                fundingAmount: this.state.fundingAmount,
                fundingPurpose: this.state.fundingPurpose,
                numTokensIssued: desiredTokenIssue
            }
            
            this.setState({loadingContract: true});
            
            const responseJson = await this.makeRequest('api/sb_input', 'POST', requestData);

            if (!isNil(responseJson.contractAddress)) { this.setState({contractAddress: responseJson.contractAddress})};

            if (!isNil(responseJson.tokenSymbol)) { this.setState({tokenSymbol: responseJson.tokenSymbol}) };

            this.setState({loadingContract: false});

        } catch (err) {
            console.log(err);
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

        return jsonResponse;
    }

    nextPath(path) {
        this.props.history.push(path);
    }

    // Tooltip Toggle Function
    toggle(pos) {
        const newState = this.state.toolTip;
        newState[pos] = !this.state.toolTip[pos];
        this.setState({ toolTip: newState});
    }

    dismissValidationAlert() {
        this.setState({ error: false });
    }

    render() {
        let buttonText = "Submit";
        let loadingText = '';

        if (this.state.loadingContract) {
            buttonText =  <Spinner animation="border" variant="light"></Spinner>;
            loadingText = <h6 padding='5px'>Your smart contract is being generated and deployed. Thank you for your patience!</h6>;
        }
        return (
            <div className='content-wrapper'>
            <Container>
                <Alert theme="warning" dismissible={this.dismissValidationAlert} open={this.state.error}>
                    {this.state.errorMessage}
                </Alert>
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <label htmlFor="#businessName">What's the name of your business?</label>
                        <InfoCircleFill className="toolTip" id="businessNameLabel" size={13} />
                        <Tooltip
                            open={this.state.toolTip.businessNameTip}
                            placement="right"
                            target="#businessNameLabel"
                            toggle={() => this.toggle("businessNameTip")}
                        >
                        Enter the name of the business you're trying to raise money for ☝️
                        </Tooltip>
                        <FormInput required onChange={(e) => this.setState({businessName:e.target.value})} id="#businessName" placeholder="Business Name" />
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="#fundingAmount">How much would you like to raise in USD?</label>
                        <InfoCircleFill className="toolTip" id="fundingAmountLabel" size={13} />
                        <Tooltip
                            open={this.state.toolTip.fundingAmountTip}
                            placement="right"
                            target="#fundingAmountLabel"
                            toggle={() => this.toggle("fundingAmountTip")}
                        >
                        You can raise as little as $50, with a maximum of $5000 (USD)!
                        </Tooltip>
                        <FormInput required onChange={(e) => this.setState({fundingAmount:e.target.value})} type="number" id="#fundingAmount" placeholder="Funding Amount" />
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="#fundingPurpose">What do you plan to use these funds for?</label>
                        <InfoCircleFill className="toolTip" id="fundingPurposeLabel" size={13} />
                        <Tooltip
                            open={this.state.toolTip.fundingPurposeTip}
                            placement="right"
                            target="#fundingPurposeLabel"
                            toggle={() => this.toggle("fundingPurposeTip")}
                        >
                        Let your customers know what you plan on doing with these funds. You can keep this simple for now! E.g. Research and Development, Paying Suppliers
                        </Tooltip>
                        <FormInput required onChange={(e) => this.setState({fundingPurpose:e.target.value})} id="#fundingPurpose" placeholder="Funding Purpose" />
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="#donationSize">What do you want the fixed investment size to be?</label>
                        <InfoCircleFill className="toolTip" id="donationSizeLabel" size={13} />
                        <Tooltip
                            open={this.state.toolTip.donationSizeTip}
                            placement="right"
                            target="#donationSizeLabel"
                            toggle={() => this.toggle("donationSizeTip")}
                        >
                        A fixed size ensures that each investor is issued a token with the same utility value.
                        </Tooltip>
                        <FormInput required onChange={(e) => this.setState({donationSize:e.target.value})} value={this.state.donationSize} type="number" id="#donationSize" placeholder="Fixed Donation Size" />
                    </FormGroup>
                    <div>
                        <Button block theme="success" type="submit">{buttonText}</Button>
                        <br/>
                        {loadingText}
                    </div>
                </Form>
                <div>
                <div>
                    {this.state.tokenSymbol === "" && this.state.contractAddress === "" ?(
                        <></>
                    ):
                        <Card className="contract-card">
                            <CardBody>
                                <CardTitle>Contract Deployment Details</CardTitle>
                                <p>View your deployed contract on Etherscan <a href={`https://rinkeby.etherscan.io/address/${this.state.contractAddress}`}>https://rinkeby.etherscan.io/address/{this.state.contractAddress}</a></p>
                                <p><b>Note: </b>Etherscan may take a few minutes to show your contract. Thank you for being patient!</p>
                                <Button onClick={() => this.nextPath(`/funding/${this.state.tokenSymbol}`)}>Go to funding page</Button>
                            </CardBody>
                        </Card>
                    }
                </div>
            </div>
        </Container>
        </div>
        );
    }

}

export default withRouter(NewFundingRound);