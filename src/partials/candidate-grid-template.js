import React from 'react';
import {
  Link,
} from "react-router-dom";

class CandidateGrid extends React.Component {

  render() {
    return (
      <Link key={this.props.data.owner} to={'/candidates/' + this.props.data.owner} className="candidate-single-grid">
        <span className="candidate-owner"><strong>{this.props.data.owner}</strong></span>
        <span className="candidate-account">{this.props.data.name}</span>
        <img src={this.props.data.picture} alt="" />
        <button className="btn">View Candidate</button>
      </Link>
    );
  }
}

export default CandidateGrid;
