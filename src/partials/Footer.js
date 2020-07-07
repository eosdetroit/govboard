import React from 'react';
import {
  Link
} from "react-router-dom";

import '../App.css';

class Footer extends React.Component {

  render() {
    return (
      <div className="footer-inner">
      <div className="footer-col-1 column">
      <h3>Helpful Links</h3>
        <ul>
          <li><Link to="/">Home</Link></li>  
          <li><Link to="/about">About</Link></li>
          <li><a href="https://www.notion.so/WAX-Office-of-Inspector-General-b519bd5514ac4da696e798c4df12b0a7" target="_blank" rel="noopener noreferrer">OIG Knowledgebase</a></li>
          <li><a href="https://medium.com/@waxoig" target="_blank" rel="noopener noreferrer">OIG Medium Blog</a></li>
          <li><a href="https://wax.io" target="_blank" rel="noopener noreferrer" >WAX Website</a></li>
        </ul>
      </div>
      <div className="footer-col-2 column">
        {this.props.activeUser ?
        <>
        <h3>Navigation</h3>
        <ul>
          <li><Link to="/candidates">Vote</Link></li>
          <li><Link to="/nominate">Nominate</Link></li>
        </ul>
        </>
        :
        <>
        </>
        }
      </div>
      </div>
    );
  }
}

export default Footer;
