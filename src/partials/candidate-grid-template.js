import React from 'react';
import {
  Link
} from "react-router-dom";

import '../App.css';

class CandidateGrid extends React.Component {

  sendCandidateInfo = () => {
  	let candidateInfo = {
  		owner: this.props.data.owner
  	};
  	this.props.callbackCandidate(candidateInfo);
  }

  render() {
    return (
      <Link to={'/candidates/' + this.props.data.owner} onClick={this.sendCandidateInfo} className="candidate-single-grid">
        {this.props.data.owner}
      </Link>
    );
  }
}

export default CandidateGrid;
