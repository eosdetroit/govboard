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

const waxMainnet = {
  chainId: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
  rpcEndpoints: [{
    protocol: 'https',
    host: 'wax.greymass.com',
    port: '443',
  }]
}

/*
const waxTestnet = {
  chainId: 'f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12',
  rpcEndpoints: [{
    protocol: 'https',
    host: 'testnet.waxsweden.org',
    port: '443',
  }]
}
*/


const APP_NAME = 'govboard';
const scatter = new Scatter([waxMainnet], { appName: APP_NAME });
const anchor = new Anchor([waxMainnet], { appName: APP_NAME });
const waxcloud = new Wax([waxMainnet], { appName: APP_NAME });
const UALConsumer = withUAL(App);


ReactDOM.render(
	<UALProvider chains={[waxMainnet]} authenticators={[waxcloud, anchor, scatter]} appName={APP_NAME}>
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
