import React from 'react';
import {
  Route,
  Link,
  Switch,
} from "react-router-dom";
import * as waxjs from "@waxio/waxjs/dist";

import './App.css';
import logo from './assets/wax-logo-white.png'
import Footer from './partials/Footer';
import Home from './components/Home';
import Vote from './components/Vote';
import Nomination from './components/Nomination';
import About from './components/About';
import ErrorPage from './components/ErrorPage';


//WAX_RPC_URL = 'https://testnet.waxsweden.org'
const WAX_RPC_URL = 'https://wax.greymass.com'
const wax = new waxjs.WaxJS(WAX_RPC_URL, null, null, false);


class App extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        activeUser: null,
        accountName: '',
        appInitialized: false,
        error: ''
      };
      this.updateAccountName = this.updateAccountName.bind(this);
      this.checkElectionStatus = this.checkElectionStatus.bind(this);
    }


    componentDidUpdate() {
      const { ual: { activeUser } } = this.props;
      if (activeUser && !this.state.activeUser) {
        this.setState({ activeUser }, this.updateAccountName);
      } else if (!activeUser && this.state.activeUser) {
        this.setState({
            activeUser: null,
            accountName: ''
        });
      }

      if (this.props.ual.activeAuthenticator && activeUser && this.state.appInitialized === false) {
        this.setState({ appInitialized: true });
      } else if (this.props.ual.error && this.state.appInitialized === false) {
        this.setState({ appInitialized: true, error: this.props.ual.message });
        //TODO: render error message
      }
      console.log(this.state);
    }

    async updateAccountName(): Promise<void> {
      try {
        const accountName = await this.state.activeUser.getAccountName();
        this.setState({ accountName });
      } catch (e) {
      console.warn(e);
      }
    }

    renderLogoutBtn = () => {
      const { ual: { activeUser, activeAuthenticator, logout } } = this.props
      if (activeUser && activeAuthenticator) {
        return (
            <span className='logoutBtn' onClick={logout}>
              {'Logout'}
            </span>
        )
      }
    }

  async checkElectionStatus() {
    let resp = await wax.rpc.get_table_rows({             
      limit: 1,
      code: 'oig',
      scope: 'oig',
      table: 'election',
      json: true
    });
    this.setState({
      electionState: resp.rows[0].state,
      electionBallot: resp.rows[0].ballot,
    });
    console.log(this.state.electionBallot);
  }

  componentDidMount() {
    this.checkElectionStatus();
  }

  render() {
    return (
      <div className="App">
        <div className="main-wrapper">
          <header id="nav">
            <div className="nav-wrapper">
              <div className="logo">
                <Link className="header-link" to="/">
                  <img src={logo} alt="WAX Logo" />
                  <span className="logo-text">&nbsp;<span className="desktop">Office of Inspector General</span><span className="mobile">OIG</span> Dashboard</span>
                </Link>
              </div>
              { this.state.activeUser ?
                <div className="menu-wrapper">
                  <div className="login-wrapper mobile">
                    <span className="accHeader">Account</span>
                    <span className="accName">{this.state.accountName}</span>
                    {this.renderLogoutBtn()}
                  </div>
                  <nav>
                    <button id="menu-icon"></button>
                    <ul>
                      <li><Link to="/">Home</Link></li>
                      <li><Link to="/about">About</Link></li>
                      <li><Link to="/candidates">Vote</Link></li>
                      <li><Link to="/nominate">Nominate</Link></li>
                    </ul>
                  </nav>
                  <div className="login-wrapper">
                    <span className="accHeader">Account</span>
                    <span className="accName">{this.state.accountName}</span>
                    {this.renderLogoutBtn()}
                  </div>
                </div>
                :
                <div className="menu-wrapper">
                  <nav>
                    <button id="menu-icon"></button>
                    <ul>
                      <li><Link to="/">Home</Link></li>
                      <li><Link to="/about">About</Link></li>
                      <li className="login-li"><button id="login" className="login-btn" onClick={this.props.ual.showModal} >Login</button></li>
                    </ul>
                  </nav>
                </div>
              }
          </div>
        </header>
        <Switch>
        <Route exact path="/">
          <Home activeUser={this.state.activeUser} />
        </Route>
        <Route exact path="/about">
          <About activeUser={this.state.activeUser} />
        </Route>
        <Route path="/candidates" render={() => {
            return (
                <Vote activeUser={this.state.activeUser} electionState={this.state.electionState} ballot={this.state.electionBallot} />
            )
          }}/>          
        <Route exact path="/nominate" render={() => {
            return (
                <Nomination activeUser={this.state.activeUser} electionState={this.state.electionState} accountName={this.state.accountName} />
            )
          }}/>
                  
        <Route path="*">
          <ErrorPage />
        </Route>
        </Switch>
        </div>
        <footer><Footer activeUser={this.state.activeUser} /></footer>
      </div>
    );
  }
}

export default App;
