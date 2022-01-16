import NewFundingRound from '../NewFundingRound/NewFundingRound';
import FundingPage from '../FundingPage/FundingPage';
import TokenRedeem from '../TokenRedeem/TokenRedeem';
import {  BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="wrapper">
      <h1>Sygs</h1>
      <BrowserRouter>
        <Switch>
          <Route path="/new-funding-round">
            <NewFundingRound/>
          </Route>
          <Route path='/funding/:tokenSymbol'>
            <FundingPage/>
          </Route>
          <Route path='/redeem/:tokenSymbol'>
            <TokenRedeem/>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
