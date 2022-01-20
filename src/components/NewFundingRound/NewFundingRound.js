import React, {useState, Component} from 'react';
import { isNil } from 'lodash';
import {
    Container,
    Form, FormInput, FormGroup, Button,
    Card, CardBody, CardTitle
} from "shards-react";
import { Spinner } from 'react-bootstrap';

export default class NewFundingRound extends Component {

    constructor(props) {
        super(props);
        this.state = {
            businessName: "",
            fundingAmount: "",
            fundingPurpose: "",
            desiredTokenIssue: 0,
            contractAddress: "",
            tokenSymbol: "",
            loadingContract: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.makeRequest = this.makeRequest.bind(this);
    }

    async handleSubmit(event) {
        console.log(this.state);
        event.preventDefault();
        
        try {
            const requestData = {
                businessName: this.state.businessName,
                fundingAmount: this.state.fundingAmount,
                fundingPurpose: this.state.fundingPurpose,
                numTokensIssued: this.state.desiredTokenIssue
            }

            console.log(requestData);
            this.setState({loadingContract: true});
            const responseJson = await this.makeRequest('api/sb_input', 'POST', requestData);

            console.log(responseJson);

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

    render() {
        let buttonText = "Submit";
        if (this.state.loadingContract) {
            buttonText =  <Spinner animation="border" variant="light" />;
        }

        return (
            <div className='content-wrapper'>
            <Container>
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <label htmlFor="#businessName">Enter Business Name</label>
                        <FormInput onChange={(e) => this.setState({businessName:e.target.value})} id="#businessName" placeholder="Business Name" />
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="#fundingAmount">Enter Total Funding Amount</label>
                        <FormInput onChange={(e) => this.setState({fundingAmount:e.target.value})} type="number" id="#fundingAmount" placeholder="Funding Amount" />
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="#fundingPurpose">Enter Funding Purpose</label>
                        <FormInput onChange={(e) => this.setState({fundingPurpose:e.target.value})} id="#fundingPurpose" placeholder="Funding Purpose" />
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="#desiredTokenIssue">Enter Total Number of Tokens You Wish to Issue</label>
                        <FormInput onChange={(e) => this.setState({desiredTokenIssue:e.target.value})} value={this.state.desiredTokenIssue} type="number" id="#desiredTokenIssue" placeholder="Number of Tokens" />
                    </FormGroup>
                    <Button block theme="success" type="submit">{buttonText}</Button>
                </Form>
                <div>
                <div>
                    {this.state.tokenSymbol === "" && this.state.contractAddress === "" ?(
                        <></>
                    ):
                    <Card className="contract-card">
                        <CardBody>
                            <CardTitle>View Deployed Contract on Etherscan:</CardTitle>
                            <h6 href={`https://rinkeby.etherscan.io/address/${this.state.contractAddress}`}>https://rinkeby.etherscan.io/address/{this.state.contractAddress}</h6>
                            <div>
                                <h5>Copy the following to embed a button for your funding page:</h5>
                                <pre>
                                    &lt;button onClick={`window.location.href='http://localhost:3000/funding/${this.state.tokenSymbol}'`}&gt;
                                        Go To Funding Page
                                    &lt;/button&gt;
                                </pre>
                                <h6>Example:</h6>
                                <form>
                                    <input type="button" onClick={`window.location.href='http://localhost:3000/funding/${this.state.tokenSymbol}'`} value="Go To Funding Page"/>
                                </form>
                            </div>
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

// function NewFundingRound() {
//     const [businessName, setBusinessName] = useState("");
//     const [fundingAmount, setFundingAmount] = useState(0);
//     const [fundingPurpose, setFundingPurpose] = useState("");
//     const [desiredTokenIssue, setDesiredTokenIssue] = useState(0);
//     const [contractAddress, setContractAddress] = useState("");
//     const [tokenSymbol, setTokenSymbol] = useState("");

//     // helper methods

//   return (
    
      
//   );
// }

// export default NewFundingRound;