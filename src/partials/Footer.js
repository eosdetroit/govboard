import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link, 
  userParams,
  useRouteMatch
} from "react-router-dom";

import '../App.css';

class Footer extends React.Component {

  render() {
    return (
      <div className="footer-inner">
      Footer
      </div>
    );
  }
}

export default Footer;
