import React from 'react';
import {
  Link,
} from "react-router-dom";

import '../App.css';

class ProducerGrid extends React.Component {

  render() {
    return (
      <Link key={this.props.data.owner} to={'/candidates/' + this.props.data.owner} className="candidate-single-grid">
        <span className="candidate-owner"><strong>{this.props.data.owner}</strong></span>
        <button className="btn">View Candidate</button>
      </Link>
    );
  }
}

export default ProducerGrid;
