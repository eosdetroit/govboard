import React from 'react';
import {
  Redirect
} from "react-router-dom";

import '../App.css';

class Home extends React.Component {
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
