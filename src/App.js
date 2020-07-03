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
        { this.state.activeUser ?
          <>
          <Link to="/candidates">Vote</Link>
          <Link to="/nominate">Nominate</Link>
          <span>{this.state.accountName}</span>
          </>
          :
          <>
          <button id="login" onClick={this.props.ual.showModal} >Login</button>
          </>
        }
        </nav>
        </div>
        </header>
        <Route exact path="/">
          <Home activeUser={this.state.activeUser} />
        </Route>
        <Route path="/candidates">
          <Vote activeUser={this.state.activeUser} />
        </Route>
        <Route path="/nominate">
          <Nomination activeUser={this.state.activeUser} accountName={this.state.accountName} />
        </Route>
        <footer><Footer /></footer>
        </Router>
      </div>
    );
  }
}

export default App;
