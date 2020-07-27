import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App  from './App';
import * as serviceWorker from './serviceWorker';
import { UALProvider, withUAL } from 'ual-reactjs-renderer';
import {BrowserRouter as Router} from 'react-router-dom';

import { Scatter } from 'ual-scatter';
import { Anchor } from 'ual-anchor';
import { Wax } from '@eosdacio/ual-wax';

const waxChain = {
  chainId: process.env.REACT_APP_WAX_CHAINID,
  rpcEndpoints: [{
    protocol: process.env.REACT_APP_WAX_PROTOCOL,
    host: process.env.REACT_APP_WAX_HOST,
    port: process.env.REACT_APP_WAX_PORT,
  }]
}

const APP_NAME = process.env.REACT_APP_NAME;

const scatter = new Scatter([waxChain], { appName: APP_NAME });
const anchor = new Anchor([waxChain], { appName: APP_NAME });
const waxcloud = new Wax([waxChain], { appName: APP_NAME });
const UALConsumer = withUAL(App);


ReactDOM.render(
	<UALProvider chains={[waxChain]} authenticators={[waxcloud, anchor, scatter ]} appName={APP_NAME}>
    	<Router>
          <UALConsumer />
      </Router>
  	</UALProvider>,
  	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
