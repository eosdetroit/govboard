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
        <li><a href="https://www.notion.so/WAX-Office-of-Inspector-General-b519bd5514ac4da696e798c4df12b0a7" target="_blank" rel="noopener noreferrer">OIG Knowledgebase</a>
        <li><a href="https://medium.com/@waxoig" target="_blank" rel="noopener noreferrer">OIG Medium Blog</a>
        <li><a href="https://wax.io" target="_blank" rel="noopener noreferrer" >WAX Website</a></li>
      </ul>
      </div>
    );
  }
}

export default Footer;
