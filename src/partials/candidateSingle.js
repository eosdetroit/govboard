import React from 'react';
import {
  Link,
  withRouter
} from "react-router-dom";

import '../App.css';

class CandidateSingle extends React.Component {

  render() {
    return (
      <div className="candidateSingle">
      {this.props.data.owner}
      </div>
    );
  }
}

export default CandidateSingle;
