import React from 'react';
import {
  Route,
  Link,
} from "react-router-dom";
import * as waxjs from "@waxio/waxjs/dist";
import { submitVote } from '../middleware.js'; 

import CandidateGrid from "../partials/candidate-grid-template.js";
import CandidateSingle from "../partials/candidateSingle";

import '../App.css';


//WAX_RPC_URL = 'https://testnet.waxsweden.org'
const WAX_RPC_URL = 'https://wax.greymass.com'
const wax = new waxjs.WaxJS(WAX_RPC_URL, null, null, false);


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
      title: '',
      description: '',
      nmn_open: '',
      nmn_close: '',
      vote_open: '',
      vote_close: '',
      leaderCandidates: [],
      ballot: ''
    };
    this.GetCandidates = this.GetCandidates.bind(this);
    this.GetElectionInfo = this.GetElectionInfo.bind(this);
    this.renderLeaderboard = this.renderLeaderboard.bind(this);
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
        let activeBallot = resp.rows[0];
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
          let formattedNomOpen = new Date(activeBallot.nmn_open + "Z").toString();
          let formattedNomClose = new Date(activeBallot.nmn_close + "Z").toString();
          let formattedVoteOpen = new Date(activeBallot.vote_open + "Z").toString();
          let formattedVoteClose = new Date(activeBallot.vote_close + "Z").toString();
          let leaderCandidates = [];
          if (Array.isArray(leaderResp.rows) && leaderResp.rows.length !== 0) {
            console.log(leaderResp.rows[0].options);
            leaderCandidates = leaderResp.rows[0].options.filter(option => option.value !== '0.00000000 VOTE').sort((a, b) => parseFloat(b.value) - parseFloat(a.value));
          }
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
          return await this.GetElectionInfo();
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

  renderLeaderboard(){
    if (this.props.electionState === 4){
      return (
        <div className="leaderboard">
        <h1>Election Leaderboard</h1>
          <div id="castvote"></div>
          <table id="leader-table">
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
                <LeaderboardRow data={leaderCandidate} index={index} activeUser={this.props.activeUser} ballot={this.state.ballot}  key={leaderCandidate.key} />
              )}
              </tbody>
            </table>
        </div>
      );
    }
  }

  componentDidMount(){
    return this.GetCandidates();
  }

  render() {
    if (this.props.electionState === 0 || this.props.electionState === 1){
      return (
        <div className="vote main-content">
          <div className="election-info">
          <h2>Election Information</h2>
          <p>There is currently no election running. Please check the <Link to="/">home page</Link> for upcoming elections.</p>
          </div>
        </div>
      )
    } else if (this.props.electionState === 5) {  
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
        <Route exact path="/candidates">
        
        <h1>Election Info</h1>
        <div className="election-info">
          
          <h2>Ballot ID: {this.state.ballot}</h2>
          <p>{this.state.description}</p>
          <table>
            <tbody>
              <tr>
                <td><p><strong>Nomination Phase begins:</strong><br />{this.state.nmn_open}</p></td>
                <td><p><strong>Voting Phase begins:</strong><br />{this.state.vote_open}</p></td>
              </tr>
              <tr>
                <td><p><strong>Nomination Phase ends:</strong><br />{this.state.nmn_close}</p></td>
                <td><p><strong>Voting Phase ends:</strong><br />{this.state.vote_close}</p></td>
              </tr>
            </tbody>
          </table>
        </div>

        <h1>Candidates</h1>
        <div className="candidate-grid">

          {this.state.candidates.slice(this.state.prevPage, this.state.nextPage).map((candidate, key) =>
              <CandidateGrid data={candidate} key={candidate.owner} />)}

        </div>
        
        {this.renderPagination()}

        {this.renderLeaderboard()}
      
        </Route>
        <Route path="/candidates/:owner">
          <CandidateSingle activeUser={this.props.activeUser} ballot={this.props.ballot} electionState={this.props.electionState} />
        </Route>
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
        this.VoteCandidate = this.VoteCandidate.bind(this);
    }

  async VoteCandidate() {
    await submitVote(this.props.activeUser, this.props.ballot, this.props.data.key);

    /* this.setState({
      refresh: 1
    }); */
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
        if (Array.isArray(resp.rows) && resp.rows.length !== 0){
          this.setState({
            name: resp.rows[0].name
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
                <td><button className="btn" onClick={this.VoteCandidate}>Vote</button></td>
      </tr>
    )
  }
}
