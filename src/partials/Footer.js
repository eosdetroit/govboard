import React from 'react';
import {
  Link
} from "react-router-dom";

import '../App.css';

class Footer extends React.Component {

  render() {
    return (
      <div className="footer-inner">
      <h3>Footer</h3>
      <ul>
        <li><Link to="/vote">Vote</Link></li>
        <li><Link to="/nominate">Nominate</Link></li>
      </ul>
      </div>
    );
  }
}

export default Footer;
