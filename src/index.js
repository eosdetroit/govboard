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
    host: 'chain.wax.io',
    port: '443',
  }]
}

const scatter = new Scatter([waxMainnet], { appName: 'WAX OIG Governance Dashboard' });
const anchor = new Anchor([waxMainnet], { appName: 'WAX OIG Governance Dashboard' });
const waxcloud = new Wax([waxMainnet], { appName: 'WAX OIG Governance Dashboard' });

const UALConsumer = withUAL(App);

ReactDOM.render(
	<UALProvider chains={[waxMainnet]} authenticators={[scatter, anchor, waxcloud]} appName={'WAX OIG Governance Dashboard'}>
    	<Router><UALConsumer /></Router>
  	</UALProvider>,
  	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
