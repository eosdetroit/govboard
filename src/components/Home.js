import React from 'react';
import {
  Link,
  Redirect
} from "react-router-dom";

import '../App.css';

class Home extends React.Component {
  constructor(props){
  	super(props);

  }


  render() {
  if (this.props.isLoggedIn === true) {
        
        return (
                <>
                <Redirect to='/vote' />
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
