import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link, 
} from "react-router-dom";

import './App.css';
import logo from './assets/wax-logo-white.png'
import Footer from './partials/Footer';
import Home from './components/Home';
import Vote from './components/Vote';
import Nomination from './components/Nomination';
import About from './components/About';

class App extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        activeUser: null,
        accountName: ''
      };
      this.updateAccountName = this.updateAccountName.bind(this);
    }

    componentDidUpdate() {
      const { ual: { activeUser } } = this.props;
      if (activeUser && !this.state.activeUser) {
        this.setState({ activeUser }, this.updateAccountName);
      } else if (!activeUser && this.state.activeUser) {
        console.log('Reset State');
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
    if (!!activeUser && !!activeAuthenticator) {
      return (
          <span className='logoutBtn' onClick={logout}>
            {'Logout'}
          </span>
      )
    }
  }

  render() {
    return (
      <div className="App">
        <Router>
        <header id="nav">
        <div className="nav-wrapper">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="WAX Logo" />
            <span className="logo-text">&nbsp;Office of Inspector General</span></Link>
        </div>
          { this.state.activeUser ?
            <nav>
              <button id="menu-icon"></button>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/candidates">Vote</Link></li>
                <li><Link to="/nominate">Nominate</Link></li>
              </ul>
            </nav>
            :
            <nav>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
              </ul>
            </nav>
          }
        <div className="login-wrapper">
          { this.state.activeUser ?
            <>
              <span className="accHeader">Account</span>
              <span className="accName">{this.state.accountName}</span>
              {this.renderLogoutBtn()}
            </>
            :
            <>
              <button id="login" onClick={this.props.ual.showModal} >Login</button>
            </>
          }
        </div>
        </div>
        </header>
        <Route exact path="/">
          <Home activeUser={this.state.activeUser} />
        </Route>
        <Route path="/about">
          <About activeUser={this.state.activeUser} />
        </Route>
        <Route path="/candidates">
          <Vote activeUser={this.state.activeUser} />
        </Route>
        <Route path="/nominate">
          <Nomination activeUser={this.state.activeUser} accountName={this.state.accountName} />
        </Route>
        <footer><Footer activeUser={this.state.activeUser} /></footer>
        </Router>
      </div>
    );
  }
}

export default App;
