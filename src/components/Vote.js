import React from 'react';
import {
  Switch,
  Route,
} from "react-router-dom";
import * as waxjs from "@waxio/waxjs/dist";

import CandidateGrid from "../partials/candidate-grid-template.js";
import CandidateSingle from "../partials/candidateSingle";

import '../App.css';

const wax = new waxjs.WaxJS('https://testnet.waxsweden.org', null, null, false);

class Vote extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      candidates: [],
      activeCandidate: null,
      candidateBound: 0,
      candidateFloor: 0,
      candidateLimit: 25,
      candidatesDisplayed: 27,
      candidatePage: 1,
    };
    this.GetCandidates = this.GetCandidates.bind(this);
    this.CandidatePaginationNext = this.CandidatePaginationNext.bind(this);
    this.CandidatePaginationPrev = this.CandidatePaginationPrev.bind(this);
  }

  async GetCandidates(){
      try {
          let resp = await wax.rpc.get_table_rows({             
            code: 'eosio',
            scope: 'eosio',
            table: 'producers',
            limit: this.state.candidatesDisplayed,
            lower_bound: this.state.candidateBound,
            json: true
          });
          this.setState({
            candidates: resp.rows,
            candidateBound: resp.rows[resp.rows.length - 3].owner,
            candidateFloor: resp.rows[resp.rows.length - resp.rows.length].owner,
            realFloor: resp.rows[resp.rows.length - resp.rows.length].owner,
            candidatePage: 1,
            sliceLimit: 0,
            lastPagination: 'next'
          });
          console.log(this.state);
      } catch(e) {
        console.log(e);
      }
    }

  async CandidatePaginationNext() {
      let candidatePage = this.state.candidatePage + 1;
      let candidatesDisplayed = this.state.candidateLimit + 2;
      let candidateBound = this.state.candidateBound;
      let candidateFloor = this.state.candidateFloor;
      try {
          if (candidatePage === 1){
          let resp = await wax.rpc.get_table_rows({             
            code: 'eosio',
            scope: 'eosio',
            table: 'producers',
            limit: candidatesDisplayed,
            lower_bound: candidateBound,
            json: true
          });
          this.setState(prevState => ({
            candidates: resp.rows,
            candidateBound: resp.rows[resp.rows.length - 1].owner,
            candidateFloor: resp.rows[resp.rows.length - resp.rows.length].owner,
            candidatePage: candidatePage,
            realFloor: prevState.realFloor,
            sliceLimit: 1,
            candidateLimit: 25,
            lastPagination: 'next'
          }));
          console.log(this.state);
        } else {
          let resp = await wax.rpc.get_table_rows({             
            code: 'eosio',
            scope: 'eosio',
            table: 'producers',
            limit: candidatesDisplayed,
            lower_bound: candidateBound,
            json: true
          });
          this.setState(prevState => ({
            candidates: resp.rows,
            candidateBound: resp.rows[resp.rows.length - 2].owner,
            candidateFloor: resp.rows[resp.rows.length - resp.rows.length].owner,
            candidatePage: candidatePage,
            realFloor: candidateFloor,
            sliceLimit: 1,
            candidateLimit: 25
          }));
          console.log(this.state);
        } 
          } catch(e) {
          console.log(e);
        }
    }

  async CandidatePaginationPrev(){
    let candidatePage = this.state.candidatePage - 1;
    let candidatesDisplayed = this.state.candidateLimit + 2;
    let realFloor = this.state.realFloor;
    try {
    if (this.state.candidatePage > 1) {
      let resp = await wax.rpc.get_table_rows({             
          code: 'eosio',
          scope: 'eosio',
          table: 'producers',
          limit: candidatesDisplayed,
          lower_bound: realFloor,
          json: true
        });
        this.setState(prevState => ({
          candidates: resp.rows,
          candidateBound: realFloor,
          candidateFloor: resp.rows[resp.rows.length - 1].owner,
          candidatePage: candidatePage,
          sliceLimit: 1,
          realFloor: prevState.realFloor,
          lastPagination: 'prev'
         }));
    }
    else {
      let candidatesDisplayed = this.state.candidateLimit + 1;
      let resp = await wax.rpc.get_table_rows({             
          code: 'eosio',
          scope: 'eosio',
          table: 'producers',
          limit: candidatesDisplayed,
          lower_bound: realFloor,
          json: true
      });
      this.setState(prevState => ({
        candidates: resp.rows,
        candidateBound: resp.rows[resp.rows.length - 2].owner,
        candidateFloor: resp.rows[resp.rows.length - resp.rows.length].owner,
        candidateLimit: 25,
        candidatesDisplayed: 27,
        candidatePage: 1,
        sliceLimit: 0,
        realFloor: prevState.realFloor,
        lastPagination: ''
      }));
    }} catch(e) {
      console.log(e);
    }
    console.log(this.state)
  }   

  componentDidMount(){
    return this.GetCandidates();
  }

  render() {
    let upperSliceLimit = this.state.candidateLimit + this.state.sliceLimit;
    console.log(this.state.candidateBound);
    console.log(this.state.candidateFloor);
    console.log(this.state.candidatePage);
    console.log(this.state.candidateBound);
    return (
      <div className="vote main-content">
        <Switch>
        <Route exact path="/candidates">
        <h2>OIG Candidates</h2>
        <div className="candidate-grid">

          {this.state.candidates.slice(this.state.sliceLimit, upperSliceLimit).map((candidate, key) =>
              <CandidateGrid data={candidate} key={candidate.owner} />)}

        </div>
        <div className="pagination-wrapper">
          <button onClick={this.CandidatePaginationPrev} className="btn">Prev</button>
          <button onClick={this.CandidatePaginationNext} className="btn">Next</button>
        </div>
        </Route>
        <Route path="/candidates/:owner">
          <CandidateSingle />
        </Route>
        </Switch>
      </div>
    );
  }
}

export default Vote;
