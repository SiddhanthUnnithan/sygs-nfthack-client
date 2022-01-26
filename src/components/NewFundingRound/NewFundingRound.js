import React, {Component} from 'react';
import { isNil } from 'lodash';
import {
    Container,
    Form, FormInput, FormGroup, Button,
    Card, CardBody, CardTitle, InputGroup, InputGroupAddon, InputGroupText
} from "shards-react";
import { Spinner } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

class NewFundingRound extends Component {

    constructor(props) {
        super(props);
        // state variables
        this.state = {
            businessName: "",
            fundingAmount: 0,
            fundingPurpose: "",
            investmentSize: 0,
            contractAddress: "",
            tokenSymbol: "",
            loadingContract: false,
        };

        // public methods
        this.handleSubmit = this.handleSubmit.bind(this);
        this.makeRequest = this.makeRequest.bind(this);
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        try {
            const desiredTokenIssue = Math.round(this.state.fundingAmount / this.state.investmentSize);
            
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
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <label htmlFor="#businessName">What's the name of your business?</label>
                        <InputGroup size="sm">
                            <FormInput onChange={(e) => this.setState({businessName:e.target.value})} id="#businessName" placeholder="Business Name" />
                        </InputGroup>
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="#fundingAmount">How much would you like to raise (USD)?</label>
                        <InputGroup size="sm">
                            <InputGroupAddon type="prepend">
                                <InputGroupText>Funding Amount</InputGroupText>
                            </InputGroupAddon>
                            <FormInput onChange={(e) => this.setState({fundingAmount:e.target.value})} id="#fundingAmount"/>
                            <InputGroupAddon type="append">
                                <InputGroupText>.00 (USD)</InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="#fundingPurpose">What do you plan to use these funds for?</label>
                        <InputGroup size="sm">
                            <FormInput onChange={(e) => this.setState({fundingPurpose:e.target.value})} id="#fundingPurpose" placeholder="Funding Purpose" />
                        </InputGroup>
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="#investmentSize">What do you want the fixed investment size to be (USD)?</label>
                        <InputGroup size="sm">
                            <InputGroupAddon type="prepend">
                                <InputGroupText>Investment Amount</InputGroupText>
                            </InputGroupAddon>
                            <FormInput onChange={(e) => this.setState({investmentSize:e.target.value})} value={this.state.investmentSize} type="number" id="#investmentSize" placeholder="Fixed Investment Size" />
                            <InputGroupAddon type="append">
                                <InputGroupText>.00 (USD)</InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>
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