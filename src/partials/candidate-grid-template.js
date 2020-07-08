import React from 'react';
import {
  Link,
} from "react-router-dom";

import '../App.css';

class CandidateGrid extends React.Component {

  render() {
    return (
      <Link key={this.props.data.owner} to={'/candidates/' + this.props.data.owner} className="candidate-single-grid">
        <span className="candidate-account">{this.props.data.name}</span>
        <img src={this.props.data.picture} alt="" />
        <button className="btn">Vote for {this.props.data.name}</button>
      </Link>
    );
  }
}

export default CandidateGrid;
