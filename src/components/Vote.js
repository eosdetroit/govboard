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
      nextPage: 0,
      prevPage: 0,
      candidateLimit: 10,
      candidatesDisplayed: 30,
      candidatePage: 1,
      ballot: '',
      title: '',
      description: '',
      nmn_open: '',
      nmn_close: '',
      vote_open: '',
      vote_close: '',
      leaderCandidates: '',
    };
    this.GetCandidates = this.GetCandidates.bind(this);
    this.GetElectionInfo = this.GetElectionInfo.bind(this);
    this.CandidatePaginationNext = this.CandidatePaginationNext.bind(this);
    this.CandidatePaginationPrev = this.CandidatePaginationPrev.bind(this);
  }

  async GetElectionInfo(){
    try {
        let resp = await wax.rpc.get_table_rows({             
          limit: 1,
          code: 'oig',
          scope: 'oig',
          table: 'election',
          json: true
        });
        let activeBallot = resp.rows[resp.rows.length - resp.rows.length];
        console.log(activeBallot);
        if (activeBallot === '') {

        } else {
          let leaderResp = await wax.rpc.get_table_rows({             
            code: 'decide',
            scope: 'decide',
            table: 'ballots',
            limit: 1,
            lower_bound: activeBallot.ballot,
            upper_bound: activeBallot.ballot,
            json: true
          });
          let leaderCandidates = leaderResp.rows[leaderResp.rows.length - 1];
          console.log(leaderCandidates);
          this.setState({
            ballot: activeBallot.ballot,
            title: activeBallot.title,
            description: activeBallot.description,
            nmn_open: activeBallot.nmn_open,
            nmn_close: activeBallot.nmn_close,
            vote_open: activeBallot.vote_open,
            vote_close: activeBallot.vote_close,
            leaderCandidates: leaderCandidates
          });
          console.log(this.state);
        }
      } catch(e) {
        console.log(e);
      }
    } 
  
  async GetCandidates(){
      try {
          let resp = await wax.rpc.get_table_rows({             
            code: 'oig',
            scope: 'oig',
            table: 'nominees',
            limit: this.state.candidatesDisplayed,
            lower_bound: this.state.nextPage,
            json: true
          });
          this.setState({
            candidates: resp.rows,
            nextPage: resp.rows[resp.rows.length - resp.rows.length].owner,
            prevPage: resp.rows[resp.rows.length - resp.rows.length].owner,
            initialFloor: resp.rows[resp.rows.length - resp.rows.length].owner,
            candidatePage: 1,
            sliceLimit: 0,
            lastPagination: 'next',
          });
          return this.GetElectionInfo();
      } catch(e) {
        console.log(e);
      }
    } 

  async CandidatePaginationNext() {
      let candidatePage = this.state.candidatePage + 1;
      let candidatesDisplayed = this.state.candidatesDisplayed;
      let nextPage = this.state.nextPage;
      let prevPage = this.state.prevPage;
      try {
          if (candidatePage === 1){
          let resp = await wax.rpc.get_table_rows({             
            code: 'oig',
            scope: 'oig',
            table: 'nominees',
            limit: candidatesDisplayed,
            lower_bound: nextPage,
            json: true
          });
          this.setState(prevState => ({
            candidates: resp.rows,
            nextPage: resp.rows[resp.rows.length - 20].owner,
            prevPage: resp.rows[resp.rows.length - resp.rows.length].owner,
            candidatePage: candidatePage,
            initialFloor: prevState.initialFloor,
            sliceLimit: 10,
            lastPagination: 'next'
          }));
          console.log(this.state);
        } else {
          let resp = await wax.rpc.get_table_rows({             
            code: 'oig',
            scope: 'oig',
            table: 'nominees',
            limit: candidatesDisplayed,
            lower_bound: nextPage,
            json: true
          });
          this.setState(prevState => ({
            candidates: resp.rows,
            nextPage: resp.rows[resp.rows.length - 2].owner,
            prevPage: resp.rows[resp.rows.length - resp.rows.length].owner,
            candidatePage: candidatePage,
            realFloor: prevPage,
            sliceLimit: 10,
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
          code: 'oig',
          scope: 'oig',
          table: 'nominees',
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
          code: 'oig',
          scope: 'oig',
          table: 'nominees',
          limit: candidatesDisplayed,
          lower_bound: realFloor,
          json: true
      });
      this.setState(prevState => ({
        candidates: resp.rows,
        nextPage: resp.rows[resp.rows.length - 2].owner,
        prevPage: resp.rows[resp.rows.length - resp.rows.length].owner,
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
    return (
      <div className="vote main-content">
        <Switch>
        <Route exact path="/candidates">
        
        <h2>Election Information</h2>
        <div className="election-info">
          
          <h3>{this.state.ballot}</h3>
          <p>{this.state.description}</p>
          <table>
            <tbody>
              <tr>
                <td><strong>Nominations begin:</strong> {this.state.nmn_open}</td>
                <td><strong>Voting begins:</strong> {this.state.vote_open}</td>
              </tr>
              <tr>
                <td><strong>Nominations end:</strong> {this.state.nmn_close}</td>
                <td><strong>Voting ends:</strong> {this.state.vote_close}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Candidates</h2>
        <div className="candidate-grid">

          {this.state.candidates.map((candidate, key) =>
              <CandidateGrid data={candidate} key={candidate.owner} />)}

        </div>
        <div className="pagination-wrapper">
          
          <button onClick={this.CandidatePaginationPrev} className="btn">Prev</button>
          <button onClick={this.CandidatePaginationNext} className="btn">Next</button>
        
        </div>
        
        <h2>Election Leaderboard</h2>
        <div className="leaderboard">
          <table>
            <thead>
              <tr>
                <th>Position</th>
                <th>Account</th>
                <th>Vote Count</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/*
              {this.state.leaderCandidates.map((leaderCandidate, key) =>
              <tr><td></td><td>{leaderCandidate.key}</td><td>{leaderCandidate.value}</td><td></td></tr>)}
              */}
              </tbody>
            </table>
        </div>
        </Route>
        <Route path="/candidates/:owner">
          <CandidateSingle activeUser={this.props.activeUser} ballot={this.state.ballot} />
        </Route>
        </Switch>
      </div>
    );
  }
}

export default Vote;
