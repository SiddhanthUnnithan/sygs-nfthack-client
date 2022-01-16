import React, {useState} from 'react';
import { isNil } from 'lodash';

function NewFundingRound() {
    const [businessName, setBusinessName] = useState("");
    const [fundingAmount, setFundingAmount] = useState(0);
    const [fundingPurpose, setFundingPurpose] = useState("");
    const [desiredTokenIssue, setDesiredTokenIssue] = useState(0);
    const [contractAddress, setContractAddress] = useState("");
    const [tokenSymbol, setTokenSymbol] = useState("");

    const handleSubmit = async(event) => {
        event.preventDefault();
        
        try {
            const requestData = {
                businessName: businessName,
                fundingAmount: fundingAmount,
                fundingPurpose: fundingPurpose,
                numTokensIssued: desiredTokenIssue
            }

            console.log(requestData);

            const responseJson = await makeRequest('api/sb_input', 'POST', requestData);

            console.log(responseJson);

            if (!isNil(responseJson.contractAddress)) { setContractAddress(responseJson.contractAddress)};

            if (!isNil(responseJson.tokenSymbol)) { setTokenSymbol(responseJson.tokenSymbol) };
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

  return (
      <div>
          <h2>Create a new funding round. Specify your funding requirements below.</h2>
          <form onSubmit={handleSubmit}>
            <label> What's the name of your business?
                <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    />
            </label><br></br>
            <label> How much would you like to raise in USD?
                <input
                    type="number"
                    value={fundingAmount}
                    onChange={(e) => setFundingAmount(e.target.value)}
                    />
            </label><br></br>
            <label> What do you plan to use these funds for?
                <input
                    type="text"
                    value={fundingPurpose}
                    onChange={(e) => setFundingPurpose(e.target.value)}
                    />
            </label><br></br>
            <label> How many tokens would you like to issue?
                <input
                    type="number"
                    value={desiredTokenIssue}
                    onChange={(e) => setDesiredTokenIssue(e.target.value)}
                    />
            </label><br></br>
            <input type="submit"/>
        </form>
        <div>
            {contractAddress === "" ? (
                <></>
            ): (
                <div>
                    <h4>View your deployed contract on Etherscan:</h4>
                    <a href={`https://rinkeby.etherscan.io/address/${contractAddress}`}>https://rinkeby.etherscan.io/address/{contractAddress}</a>
                </div>
            )
            }
        </div>
        <div>
            {tokenSymbol === "" ? (
                <></>
            ): 
                <div>
                    <h4>Copy the following to embed a button for your funding page:</h4>
                    <pre>
                        &lt;button onClick={`window.location.href='http://localhost:3000/funding/${tokenSymbol}'`}&gt;
                            Go To Funding Page
                        &lt;/button&gt;
                    </pre>
                    <h4>Example:</h4>
                    <form>
                        <input type="button" onClick={`window.location.href='http://localhost:3000/funding/${tokenSymbol}'`} value="Go To Funding Page"/>
                    </form>
                </div>
            }
        </div>
      </div>
      
  );
}

export default NewFundingRound;