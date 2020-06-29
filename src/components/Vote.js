import React from 'react';
import {
  Route,
  Switch,
  Link,
  useRouteMatch
} from "react-router-dom";
import * as waxjs from "@waxio/waxjs/dist";

import CandidateGrid from "../partials/candidate-grid-template.js";
import CandidateSingle from "../partials/candidateSingle";

import '../App.css';

const wax = new waxjs.WaxJS('http://wax.greymass.com', null, null, false);

let candidatePage = 1;
let candidatesDisplayed = 10;
let candidateLimit = 10;
let candidateBound = 0;

class Vote extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      candidates: [],
      activeCandidate: []
    };
    this.GetCandidates = this.GetCandidates.bind(this);
    this.CandidatePaginationNext = this.CandidatePaginationNext.bind(this);
    this.CandidatePaginationPrev = this.CandidatePaginationPrev.bind(this);
  }

  async GetCandidates(){
      try {
        const resp = await wax.rpc.get_producers({              // Get the response as json
          limit: candidatesDisplayed,
          lower_bound: candidateBound,
          json: false
        });
        console.log(resp);
        this.setState({
          candidates: resp.rows
        });
      } catch(e) {
        console.log(e);
      }
    }

  async CandidatePaginationNext(){
      candidatePage = candidatePage + 1;
      candidatesDisplayed = 50*candidatePage;
      candidateBound = candidatesDisplayed-candidateLimit;
      console.log(candidateBound);
      return this.GetCandidates();
    }

  async CandidatePaginationPrev(){
    if (candidatePage > 1) {
    candidatePage = candidatePage - 1;
    candidatesDisplayed = 50*candidatePage;
    candidateBound = candidatesDisplayed+candidateLimit;
    return this.GetCandidates();
    }
  }   

  viewCandidate = (candidateInfo) => {
    this.setState({
        activeCandidate: candidateInfo
    });
  }

  componentWillMount(){
    return this.GetCandidates();
  }

  render() {
    return (
      <Switch>
      <div className="vote main-content">
        <h2>Vote</h2>
        <Route exact path="/candidates">
        <div className="candidate-grid">
          {this.state.candidates.map((candidate, key) =>
              <CandidateGrid callbackCandidate={this.viewCandidate} data={candidate} key={candidate.owner} />)}
        <button onClick={this.CandidatePaginationPrev}>Prev</button>
        <button onClick={this.CandidatePaginationNext}>Next</button>
        </div>
        </Route>
        <Route path="/candidates/:owner">
          <CandidateSingle data={this.state.activeCandidate} />
        </Route>
      </div>
      </Switch>
    );
  }
}

export default Vote;
