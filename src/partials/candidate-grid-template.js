import React from 'react';
import {
  Link,
} from "react-router-dom";

import '../App.css';
import placeholder from '../assets/candidate-placeholder.jpg';

class CandidateGrid extends React.Component {
  render() {
    return (
      <Link key={this.props.data.owner} to={'/candidates/' + this.props.data.owner} className="candidate-single-grid">
        <span className="candidate-account">{this.props.data.owner}</span>
        <img src={placeholder} alt="" />
        <button onClick={this.VoteCandidate} className="btn">Vote for {this.props.data.owner}</button>
      </Link>
    );
  }
}

export default CandidateGrid;
