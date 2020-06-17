import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link, 
  userParams,
  useRouteMatch
} from "react-router-dom";

import './App.css';

class App extends React.Component {
  


  render() {
    return (
      <div className="App">
        <header></header>
        <Route exact path="/">
          <Home />
        </Route>
        <footer></footer>
      </div>
    );
  }
}

export default App;
