import React from 'react';
import {
  Switch,
  Route,
  Link,
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
      nextPage: 10,
      prevPage: 0,
      candidateLimit: 10,
      candidatesDisplayed: 100,
      candidatePage: 0,
      ballot: '',
      title: '',
      description: '',
      nmn_open: '',
      nmn_close: '',
      vote_open: '',
      vote_close: '',
      leaderCandidates: [],
    };
    this.GetCandidates = this.GetCandidates.bind(this);
    this.GetElectionInfo = this.GetElectionInfo.bind(this);
    this.castVote = this.castVote.bind(this);
    this.renderPagination = this.renderPagination.bind(this);
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
          let leaderCandidates = leaderResp.rows[leaderResp.rows.length - leaderResp.rows.length].options.sort((a, b) => parseFloat(b.value) - parseFloat(a.value));
          console.log(leaderCandidates);
          let formattedNomOpen = new Date(activeBallot.nmn_open).toString();
          let formattedNomClose = new Date(activeBallot.nmn_close).toString();
          let formattedVoteOpen = new Date(activeBallot.vote_open).toString();
          let formattedVoteClose = new Date(activeBallot.vote_close).toString();
          console.log(formattedNomOpen);
          this.setState({
            ballot: activeBallot.ballot,
            title: activeBallot.title,
            description: activeBallot.description,
            nmn_open: formattedNomOpen,
            nmn_close: formattedNomClose,
            vote_open: formattedVoteOpen,
            vote_close: formattedVoteClose,
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
            lower_bound: 1,
            limit: this.state.candidatesDisplayed,
            json: true
          });
          let displayPagination = 0;
          if (resp.rows.length > 10) {
            displayPagination = 1;
          }
          let maxPage = (resp.rows.length / 10);
          this.setState({
            candidates: resp.rows,
            candidatePage: 1,
            maxPage: maxPage,
            displayPagination: displayPagination
          });
          return this.GetElectionInfo();
      } catch(e) {
        console.log(e);
      }
    } 

  async CandidatePaginationNext() {
      if (this.state.ceilingReached === 1){
          // Do Nothing
      }
      else if (this.state.maxPage - this.state.candidatePage >= 1 && this.state.nextPage !== this.state.candidates.length) {
          let candidatePage = this.state.candidatePage + 1;
          let prevPage = this.state.prevPage + 10;
          let nextPage = this.state.nextPage + 10;
          this.setState({
            nextPage: nextPage,
            prevPage: prevPage,
            candidatePage: candidatePage,
          });
          console.log(this.state);
        } else if (this.state.maxPage - this.state.candidatePage < 1 && this.state.nextPage !== this.state.candidates.length) {
          let prevPage = this.state.prevPage + 10;
          let nextPage = this.state.candidates.length;
          console.log()
          this.setState({
            nextPage: nextPage,
            prevPage: prevPage,
            ceilingReached: 1
          })
          console.log(this.state);
        }
      }

  CandidatePaginationPrev(){
    let candidatePage = this.state.candidatePage - 1;
    if (this.state.candidatePage === 0){
      this.setState({
        nextPage: 10,
        prevPage: 0,
        candidatePage: 0,
        ceilingReached: 0
      });
    } else if (this.state.maxPage - this.state.candidatePage < 1) {
      let prevPage = this.state.prevPage - 10;
      let nextPage = this.state.candidates.length - (this.state.maxPage - this.state.candidatePage)*10 ;
      this.setState({
        nextPage: nextPage,
        prevPage: prevPage,
        candidatePage: candidatePage,
        ceilingReached: 0
      });
      console.log(nextPage);
    } else {
      let prevPage = this.state.prevPage - 10;
      let nextPage = this.state.nextPage - 10;
      this.setState({
      nextPage: nextPage,
      prevPage: prevPage,
      candidatePage: candidatePage,
      ceilingReached: 0
      });
    }
    console.log(this.state);
  }  

  renderPagination(){
    if (this.state.displayPagination === 1){
      return (
        <div className="pagination-wrapper">
          <button onClick={this.CandidatePaginationPrev} className="btn">Prev</button>
          <button onClick={this.CandidatePaginationNext} className="btn">Next</button>
        </div>
      );
    } else {
      // Do not render
    }
  }

  componentDidMount(){
    return this.GetCandidates();
  }

  async castVote(event) {
  
    const value = event.target.value;
    const regTransaction = {
        actions: [{
          account: 'decide',
          name: 'regvoter',
          authorization: [{
            actor: this.props.activeUser.accountName,
            permission: 'active',
          }],
          data: {
            voter: this.props.activeUser.accountName,
            treasury_symbol: '8,VOTE',
            referrer: ''
          },
        }]
      };
    try {
      let checkReg = await wax.rpc.get_table_rows({
            code: 'decide',
            scope: this.props.activeUser.accountName,
            table: 'voters',
            limit: 1,
            json: true
      });
      if (checkReg === '') {
      const regResult = await this.props.activeUser.signTransaction(
        regTransaction, {blocksBehind: 3,
        expireSeconds: 30
      });
      console.log(regResult);
      } else {
      const voteTransaction = {
        actions: [{
          account: 'decide',
          name: 'sync',
          authorization: [{
            actor: this.props.activeUser.accountName,
            permission: 'active',
          }],
          data: {
            voter: this.props.activeUser.accountName,
          },
        },
        {
          account: 'decide',
          name: 'castvote',
          authorization: [{
            actor: this.props.activeUser.accountName,
            permission: 'active',
          }],
          data: {
            voter: this.props.activeUser.accountName,
            options: [value],
            ballot_name: this.state.ballot
          },
        }]
      };
      const voteResult = await this.props.activeUser.signTransaction(
        voteTransaction, {blocksBehind: 3,
        expireSeconds: 30
      });
      console.log(voteResult);
    }
    } catch(e) {
      console.log(e);
    }
  }

  render() {
    if (this.props.electionState === 0 && this.props.electionState === 1){
      return (
        <div className="vote main-content">
          <div className="election-info">
          <h2>Election Information</h2>
          <p>There is currently no election running. Please check the <Link to="/">home page</Link> for upcoming elections.</p>
          </div>
        </div>
      )
    } else if (this.props.electionState === 4 || this.props.electionState === 5) {  
      return (
        <div className="vote main-content">
          <div className="election-info">
          <h2>Election Information</h2>
          <p>The voting period for the current election has concluded. Please check back soon for announcement of the winner.</p>
          </div>
        </div>
        );
    } else {
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
                <td><strong>Nominations begin:</strong><br />{this.state.nmn_open}</td>
                <td><strong>Voting begins:</strong><br />{this.state.vote_open}</td>
              </tr>
              <tr>
                <td><strong>Nominations end:</strong><br />{this.state.nmn_close}</td>
                <td><strong>Voting ends:</strong><br />{this.state.vote_close}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Candidates</h2>
        <div className="candidate-grid">

          {this.state.candidates.slice(this.state.prevPage, this.state.nextPage).map((candidate, key) =>
              <CandidateGrid data={candidate} key={candidate.owner} />)}

        </div>
    
        {this.renderPagination}
        
        <h2>Election Leaderboard</h2>
        <div className="leaderboard">
          <table>
            <thead>
              <tr>
                <th>Position</th>
                <th>Candidate</th>
                <th>Account</th>
                <th>Vote Count</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.state.leaderCandidates.slice(0, 10).map((leaderCandidate, key, index, value) =>
                <LeaderboardRow data={leaderCandidate} index={index} key={leaderCandidate.key} />
              )}
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
}

export default Vote;

class LeaderboardRow extends Vote {
  constructor(props){
        super(props);
        console.log(this.props); // prints out whatever is inside props
        this.GetCandidateName = this.GetCandidateName.bind(this);
    }

  async GetCandidateName(){
    let resp = await wax.rpc.get_table_rows({             
          code: 'oig',
          scope: 'oig',
          table: 'nominees',
          limit: 1,
          lower_bound: this.props.data.key,
          upper_bound: this.props.data.key,
          json: true
        });
        console.log(resp);
        if (resp.rows !== ''){
          this.setState({
            name: resp.rows[resp.rows.length - resp.rows.length].name
          });
        }
  }

  componentDidMount(){
    return this.GetCandidateName();
  }

  render(){
    const index = this.props.index.findIndex(x => x.key === this.props.data.key);
    return (
      <tr key={this.props.data.key}>
                <td>{index + 1}</td>
                <td><Link to={"/candidates/" + this.props.data.key}>{this.state.name}</Link></td>
                <td>{this.props.data.key}</td>
                <td><span className="vote-count">{this.props.data.value}S</span></td>
                <td><button value={this.props.data.key} onClick={this.castVote} className="btn">Vote</button></td>
            </tr>
    )
  }
}
