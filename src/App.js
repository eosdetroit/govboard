import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link, 
  userParams,
  useRouteMatch
} from "react-router-dom";
import * as waxjs from "@waxio/waxjs/dist";
import { Api, JsonRpc } from '@waxio/waxjs/dist';

import './App.css';
import logo from './assets/wax-logo-white.png'
import Footer from './partials/Footer';
import Home from './components/Home';
import Vote from './components/Vote';
import Nomination from './components/Nomination';

const wax = new waxjs.WaxJS('https://wax.greymass.com');

autoLogin();

async function autoLogin() {
        let isAutoLoginAvailable = await wax.isAutoLoginAvailable();
        if (isAutoLoginAvailable) {
            let userAccount = wax.userAccount;
            let pubKeys = wax.pubKeys;
        }
        else {
            console.log('Not auto-logged in');
        }
    };

class App extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        isLoggedIn: false,
        acct: ''
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
        <header id="nav">
        <div className="nav-wrapper">
        <div className="logo">
          <Link to="/"><img src={logo} alt="WAX Logo" />&nbsp;<span className="logo-text">Office of the Inspector General</span></Link>
        </div>
        <nav>
        {
          this.state.isLoggedIn ?
            <>
            <Link to="/vote">Vote</Link>
            <Link to="/nominate">Nominate</Link>
            </>
          :
          <>
          <button id="login" onClick={this.login} >Login</button>
          </>
        }
        </nav>
        </div>
        </header>
        <Route exact path="/">
          <Home isLoggedIn={this.state.isLoggedIn} />
        </Route>
        <Route exact path="/vote">
          <Vote isLoggedIn={this.state.isLoggedIn} />
        </Route>
        <Route exact path="/nominate">
          <Nomination isLoggedIn={this.state.isLoggedIn} />
        </Route>
        <footer><Footer /></footer>
        </Router>
      </div>
    );
  }
}

export default App;
