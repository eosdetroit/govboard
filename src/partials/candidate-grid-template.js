import React from 'react';
import {
  Link
} from "react-router-dom";

import '../App.css';

class CandidateGrid extends React.Component {

  render() {
    return (
      <div className="candidate-single-grid">
        {this.props.data.owner}
      </div>
    );
  }
}

export default CandidateGrid;
