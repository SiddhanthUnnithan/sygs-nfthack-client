import React, { Component } from 'react';
import {
    Container,
    Row, Col,
    Card, CardTitle, CardBody
} from 'shards-react';

class HomePage extends Component {
    constructor(props){
        super(props);
        this.state = {

        };
    }

    render() {
        return(
            <div className='content-wrapper'>
                <Container>
                    <Row>
                        <Col>
                            <Card className="contract-card">
                                <CardTitle>Define Funding Requirements</CardTitle>
                                <CardBody>
                                    <p>Simple inputs to specify fundraising requirements for your small business. We help manage smart-contract creation and deployments on your behalf!</p>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col>
                            <Card className="contract-card">
                                <CardTitle>Minimal Transaction Fees</CardTitle>
                                <CardBody>
                                    <p>We take care of all transaction fees associated with contract creation and token issuance, allowing your business to focus on the capital it needs!</p>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card className="contract-card">
                                <CardTitle>Incentivized NFT Holdings</CardTitle>
                                <CardBody>
                                    <p>Use your investment tokens to earn discounts and rewards! Trade or re-sell your investment tokens on the Open Market to earn in crypto!</p>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col>
                            <Card className="contract-card">
                                <CardTitle>Tokenized Funding for Small Businesses</CardTitle>
                                <CardBody>
                                    <p>For the first time, support your favourite businesses and receive a unique non-fungible-token (NFT) to represent your investment!</p>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default HomePage;