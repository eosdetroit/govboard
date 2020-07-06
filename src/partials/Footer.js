import React from 'react';
import {
  Link
} from "react-router-dom";

import '../App.css';

class Footer extends React.Component {

  render() {
    return (
      <div className="footer-inner">
      <h3>Helpful Links</h3>
      <ul>
        {this.props.activeUser ?
        <>
          <li><Link to="/candidates">Vote</Link></li>
          <li><Link to="/nominate">Nominate</Link></li>
        </>
        :
        <>
        </>
        }
        <li><a href="https://wax.io">WAX Website</a></li>
      </ul>
      </div>
    );
  }
}

export default Footer;
