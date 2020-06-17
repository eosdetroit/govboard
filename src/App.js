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

class App extends React.Component {
  


  render() {
    return (
      <div className="App">
        <header><Header /></header>
        <Router>
        <Route exact path="/">
          <Home />
        </Route>
        </Router>
        <footer><Footer /></footer>
      </div>
    );
  }
}

export default App;
