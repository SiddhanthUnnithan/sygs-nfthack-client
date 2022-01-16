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

            const responseJson = await makeRequest('/api/sb_input', 'POST', requestData);

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
          <h2>Input your funding requirements!</h2>
          <form onSubmit={handleSubmit}>
            <label> Enter your business name:
                <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    />
            </label><br></br>
            <label> Enter your funding amount:
                <input
                    type="number"
                    value={fundingAmount}
                    onChange={(e) => setFundingAmount(e.target.value)}
                    />
            </label><br></br>
            <label> Enter your funding purpose:
                <input
                    type="text"
                    value={fundingPurpose}
                    onChange={(e) => setFundingPurpose(e.target.value)}
                    />
            </label><br></br>
            <label> Enter the number of tokens you wish to issue:
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
                </div>
            }
        </div>
      </div>
      
  );
}

export default NewFundingRound;