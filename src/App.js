import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link, 
  userParams,
  useRouteMatch
} from "react-router-dom";

import './App.css';
import Header from './partials/Header';
import Footer from './partials/Footer';
import Home from './components/Home';
import Vote from './components/Vote';
import Nominate from './components/Nominate';

class App extends React.Component {
  


  render() {
    return (
      <div className="App">
        <header><Header /></header>
        <Router>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/vote">
          <Vote />
        </Route>
        <Route exact path="/nominate">
          <Nominate />
        </Route>
        </Router>
        <footer><Footer /></footer>
      </div>
    );
  }
}

export default App;
