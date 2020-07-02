import React from 'react';
import {
  Link,
  Redirect
} from "react-router-dom";
import { Api, JsonRpc } from '@waxio/waxjs/dist';

import '../App.css';

class Home extends React.Component {
  constructor(props){
  	super(props);

  }
  

  render() {
  if (this.props.activeUser != null) {
        
        return (
                <>
                <Redirect to='/candidates' />
                </>
                )
    }
    return (
      <div className="home main-content">
        <h2>Home</h2>
      </div>
    );
  }
}

export default Home;
