import React from 'react';
import {  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";

import '../App.css';

class CandidateGrid extends React.Component {
  render() {
    return (
      <Link key={this.props.data.owner} to={'/candidates/' + this.props.data.owner} className="candidate-single-grid">
        {this.props.data.owner}
      </Link>
    );
  }
}

export default CandidateGrid;
