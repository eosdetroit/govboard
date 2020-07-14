import React from 'react';
import {
  Link
} from "react-router-dom";

import '../App.css';
import notionLogo from '../assets/notion.png';
import mediumLogo from '../assets/medium.png';
import waxLogo from '../assets/wax-primary-logo.png';


class Footer extends React.Component {

  render() {
    return (
      <div className="footer-inner">
      <div className="footer-col-1 column">
      <h1>Helpful Links</h1>
        <a href="https://www.notion.so/WAX-Office-of-Inspector-General-b519bd5514ac4da696e798c4df12b0a7" title="OIG Knowledge Base" target="_blank" rel="noopener noreferrer">
          <img class='footer-image' src={notionLogo} alt="OIG Knowledge Base" />
        </a>    
        <a href="https://medium.com/@waxoig" target="_blank" rel="noopener noreferrer">
          <img class='footer-image' src={mediumLogo} alt="Medium" />
        </a>
        <a href="https://wax.io" target="_blank" rel="noopener noreferrer" >
        <img class='footer-image' src={waxLogo} alt="WAX" />
        </a>
      </div>
      </div>
    );
  }
}

export default Footer;
