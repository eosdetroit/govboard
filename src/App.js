/** @jsx jsx */

import React from 'react';
import {
  Route,
  Switch,
  NavLink
} from "react-router-dom";
import { Navbar } from 'react-bootstrap';

import * as waxjs from "@waxio/waxjs/dist";
import { jsx } from '@emotion/react';
import * as GLOBAL_STYLE from './theme';

import waxLogo from './assets/wax-primary-logo.png';
import Hamburguer from './assets/hamburguer.svg';
import BlueBee from './assets/blueBee.svg';
import Footer from './partials/Footer';
import Home from './components/Home';
import Vote from './components/Vote';
import Nomination from './components/Nomination';
import About from './components/About';
import ErrorPage from './components/ErrorPage';

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

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
            <GLOBAL_STYLE.Button tiny text onClick={logout}>
              {'Logout'}
            </GLOBAL_STYLE.Button>
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
  }

  componentDidMount() {
    this.checkElectionStatus();
  }

  render() {
    return (
        <div className="App">
            <div>
                <header
                    css={{
                        paddingLeft: GLOBAL_STYLE.spacing.xs,
                        paddingRight: GLOBAL_STYLE.spacing.xs,
                        [GLOBAL_STYLE.mediaQuery.largeMobileUp]: {
                            paddingLeft: GLOBAL_STYLE.spacing.s,
                            paddingRight: GLOBAL_STYLE.spacing.s,
                        },
                        '& .navbar': {
                            zIndex: '9999',
                            display: 'flex',
                            flexDirection: 'row',
                            paddingRight: 0,
                            paddingLeft: 0,
                        },
                        '& .brand': {
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                        },
                        '& .logo': {
                            width: '40px',
                            objectFit: 'contain',
                            marginRight: GLOBAL_STYLE.spacing.xxs,
                            [GLOBAL_STYLE.mediaQuery.largeMobileUp]: {
                                width: '70px',
                            },
                            [GLOBAL_STYLE.mediaQuery.desktopUp]: {
                                width: '100px',
                            },
                        },
                        '& .title': {
                            margin: '0',
                            fontWeight: 400,
                            [GLOBAL_STYLE.mediaQuery.mobileOnly]: {
                                display: 'none',
                            },
                        },
                        '& .titleMobile': {
                            margin: '0',
                            fontWeight: 400,
                            [GLOBAL_STYLE.mediaQuery.largeMobileUp]: {
                                display: 'none',
                            },
                        },
                        '& .navbar-toggler-icon': {
                            height: '60px',
                            minWidth: '60px',
                            backgroundImage: `url(${Hamburguer})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '60px',
                        },
                        '& .toggleButton': {
                            border: 'none',
                            padding: '0',
                        },
                        '& .link': {
                            textDecoration: 'none',
                            color: GLOBAL_STYLE.colors.blue02,
                            margin: `0 0 ${GLOBAL_STYLE.spacing.l} 0`,
                            '&:hover': {
                                color: GLOBAL_STYLE.colors.blue01,
                                transition: 'color 0.3s ease-in-out',
                            },
                            [GLOBAL_STYLE.mediaQuery.desktopUp]: {
                                margin: `0 0 0 ${GLOBAL_STYLE.spacing.m}`,
                                '&:last-of-type': {
                                    marginRight: GLOBAL_STYLE.spacing.m,
                                },
                            },
                            h5: {
                                fontWeight: '400',
                                margin: '0',
                            },
                        },
                        '& .link--active': {
                            color: GLOBAL_STYLE.colors.blue01,
                        },
                        '& .collapseSection': {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: `${GLOBAL_STYLE.spacing.s} 0`,
                            [GLOBAL_STYLE.mediaQuery.desktopUp]: {
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                            },
                            '&:not(.show)': {
                                display: 'none',
                            },
                        },
                        '& .blueBee': {
                            height: '30px',
                            objectFit: 'contain',
                            marginBottom: GLOBAL_STYLE.spacing.s,
                            [GLOBAL_STYLE.mediaQuery.desktopUp]: {
                                height: '40px',
                                margin: `0 ${GLOBAL_STYLE.spacing.s} 0 0`,
                            },
                        },
                    }}
                >
                    <Navbar collapseOnSelect expand="xl" className="navbar">
                        <Navbar.Brand className="brand" href="/">
                            <img src={waxLogo} className="logo" alt="WAX Logo" />
                            <GLOBAL_STYLE.H6 className="title">Office of Inspector General Dashboard</GLOBAL_STYLE.H6>
                            <GLOBAL_STYLE.H6 className="titleMobile">OIG Dashboard</GLOBAL_STYLE.H6>
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" className="toggleButton" />
                        <Navbar.Collapse id="responsive-navbar-nav" className="collapseSection">
                            <NavLink to="/about" className="link" activeClassName="link--active">
                                <GLOBAL_STYLE.H5>About</GLOBAL_STYLE.H5>
                            </NavLink>
                            {this.state.activeUser ? (
                                <React.Fragment>
                                    <NavLink to="/candidates" className="link" activeClassName="link--active">
                                        <GLOBAL_STYLE.H5>Vote</GLOBAL_STYLE.H5>
                                    </NavLink>
                                    <NavLink to="/nominate" className="link" activeClassName="link--active">
                                        <GLOBAL_STYLE.H5>Nominate</GLOBAL_STYLE.H5>
                                    </NavLink>
                                    <img src={BlueBee} className="blueBee" alt="Drawed bee with blue stroke" />
                                    <div
                                        css={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            '& .accountName': {
                                                marginBottom: GLOBAL_STYLE.spacing.xxs,
                                                color: GLOBAL_STYLE.colors.blue01,
                                                fontWeight: '600',
                                            },
                                        }}
                                    >
                                        <p className="accountName">{this.state.accountName}</p>
                                        {this.renderLogoutBtn()}
                                    </div>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <NavLink to="/candidates" className="link" activeClassName="link--active">
                                        <GLOBAL_STYLE.H5>Candidates</GLOBAL_STYLE.H5>
                                    </NavLink>
                                    <img src={BlueBee} className="blueBee" alt="Drawed bee with blue stroke" />
                                    <GLOBAL_STYLE.Button text id="login" onClick={this.props.ual.showModal}>
                                        Login
                                    </GLOBAL_STYLE.Button>
                                </React.Fragment>
                            )}
                        </Navbar.Collapse>
                    </Navbar>
                </header>
                <Switch>
                    <Route exact path="/">
                        <Home activeUser={this.state.activeUser} />
                    </Route>
                    <Route exact path="/about">
                        <About activeUser={this.state.activeUser} />
                    </Route>
                    <Route
                        path="/candidates"
                        render={() => {
                            return (
                                <Vote
                                    activeUser={this.state.activeUser}
                                    electionState={this.state.electionState}
                                    ballot={this.state.electionBallot}
                                />
                            );
                        }}
                    />
                    <Route
                        exact
                        path="/nominate"
                        render={() => {
                            return (
                                <Nomination
                                    activeUser={this.state.activeUser}
                                    electionState={this.state.electionState}
                                    accountName={this.state.accountName}
                                />
                            );
                        }}
                    />

                    <Route path="*">
                        <ErrorPage />
                    </Route>
                </Switch>
            </div>
            <footer>
                <Footer activeUser={this.state.activeUser} />
            </footer>
        </div>
    );
  }
}

export default App;
