import NewFundingRound from '../NewFundingRound/NewFundingRound';
import FundingPage from '../FundingPage/FundingPage';
import TokenRedeem from '../TokenRedeem/TokenRedeem';
import NavBar from '../NavBar/NavBar';
import {  BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";

function App() {
  return (
    <div className="wrapper">
      <NavBar/>
      <BrowserRouter>
        <Switch>
          <Route path='/home'>
          </Route>
          <Route path='/about'>
          </Route>
          <Route path="/new-funding-round">
            <NewFundingRound/>
          </Route>
          <Route path='/funding/:tokenSymbol' component={FundingPage}/>
          <Route path='/redeem/:tokenSymbol'>
            <TokenRedeem/>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
