import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link, 
  userParams,
  useRouteMatch
} from "react-router-dom";
import * as waxjs from "@waxio/waxjs/dist";

import './App.css';
import Footer from './partials/Footer';
import Home from './components/Home';
import Vote from './components/Vote';
import Nomination from './components/Nomination';

const wax = new waxjs.WaxJS('https://wax.greymass.com');

async function autoLogin() {
        let isAutoLoginAvailable = await wax.isAutoLoginAvailable();
        if (isAutoLoginAvailable) {
            let userAccount = wax.userAccount;
            let pubKeys = wax.pubKeys;
        }
        else {
            document.getElementById('nav').insertAdjacentHTML('beforeend', 'Not auto-logged in');
        }
    }

autoLogin();

class App extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        isLoggedIn: false
      };
      this.login = this.login.bind(this);
    }

  async login() {
  try {
        const userAccount = await wax.login();
        const pubKeys = wax.pubKeys;
        let str = 'Account: ' + userAccount;
        this.setState({ 
          isLoggedIn: true,
          acct: userAccount
         });
        console.log(this.state)
      } catch(e) {
        document.getElementById('nav').append(e.message);
      }
    }

  render() {
    return (
      <div className="App">
        <Router>
        <header id="nav">{
          this.state.isLoggedIn ?
          <nav>
            <Link to="/vote">Vote</Link>&nbsp;
            <Link to="/nominate">Nominate</Link>&nbsp;
            {this.state.acct}
          </nav>
          :
          <>
          <button id="login" onClick={this.login} >WAX Login</button>
          </>
        }
        <span id="accountName"></span>
        <nav>
        </nav>
        </header>
        <Route exact path="/">
          <Home isLoggedIn={this.state.isLoggedIn} />
        </Route>
        <Route exact path="/vote">
          <Vote />
        </Route>
        <Route exact path="/nominate">
          <Nomination />
        </Route>
        <footer><Footer /></footer>
        </Router>
      </div>
    );
  }
}

export default App;
