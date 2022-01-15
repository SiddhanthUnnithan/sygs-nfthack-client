import NewFundingRound from '../NewFundingRound/NewFundingRound';
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
          </Route>
          <Route path='/funding/:tokenSymbol/redeem'>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
