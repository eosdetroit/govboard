import React from 'react';
import {
  withRouter
} from "react-router-dom";
import * as waxjs from "@waxio/waxjs/dist";

import '../App.css';

const wax = new waxjs.WaxJS('https://testnet.waxsweden.org', null, null, false);

class CandidateSingle extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      nominee: '',
      logo_256: '',
      description: '',
      website: '',
      telegram: '',
      twitter: '',
      wechat: ''
    }
    this.UnvoteCandidate = this.UnvoteCandidate.bind(this);
    this.VoteCandidate = this.VoteCandidate.bind(this);
  }

  componentDidMount = () => {
    const owner = this.props.match.params.owner;
    this.fetchData(owner);
  }

  async fetchData(owner) {
     try {
      let resp = await wax.rpc.get_table_rows({             
            code: 'oig',
            scope: 'oig',
            table: 'nominees',
            limit: 1,
            lower_bound: owner,
            upper_bound: owner,
            json: true
        });
        this.setState({
          nominee: resp.rows[resp.rows.length - resp.rows.length].owner,
          name: resp.rows[resp.rows.length - resp.rows.length].name,
          logo_256: resp.rows[resp.rows.length - resp.rows.length].logo_256,
          description: resp.rows[resp.rows.length - resp.rows.length].descriptor,
          telegram: resp.rows[resp.rows.length - resp.rows.length].telegram,
          twitter: resp.rows[resp.rows.length - resp.rows.length].twitter,
          wechat: resp.rows[resp.rows.length - resp.rows.length].wechat
          });
          console.log(this.state);
          } catch(e) {
          console.log(e);
      }       // ...
  };

  async UnvoteCandidate(){

  }

  async VoteCandidate(){
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
      let getBallot = await wax.rpc.get_table_rows({             
            code: 'decide',
            scope: 'decide',
            table: 'ballots',
            limit: 100,
            json: true
      });
      if (checkReg == '') {
      const regResult = await this.props.activeUser.signTransaction(
        regTransaction, {blocksBehind: 3,
        expireSeconds: 30
      });
      } else {
      const voteTransaction = {
        actions: [{
          account: 'decide',
          name: 'castvote',
          authorization: [{
            actor: this.props.activeUser.accountName,
            permission: 'active',
          }],
          data: {
            voter: this.props.activeUser.accountName,
            options: [this.state.nominee],
            ballot_name: getBallot.rows[getBallot.rows.length - 1].ballot_name
          },
        }]
      };      
      const voteResult = await this.props.activeUser.signTransaction(
        voteTransaction, {blocksBehind: 3,
        expireSeconds: 30
      });
    }
    } catch(e) {
      console.log(e);
    }
  }

  render() {
    return (
      <div className="candidate-single">
        <div className="candidate-header">
          <h2>{this.state.name}</h2>
          <span><i>Candidate for WAX OIG</i></span>
        </div>
        <div className="candidate-left-pane">
          <img src={this.state.logo_256} alt="{this.state.nominee}" />
        </div>
        <div className="candidate-right-pane">
          <p className="description">{this.state.description}</p>
          <strong>Social Media</strong>
          <ul>
            { this.state.twitter ? 
              <>
                <li>Telegram: {this.state.telegram}</li>
              </>
              :
              <>
              </>
            }
            { this.state.telegram ? 
              <>
                <li><a href={this.state.twitter} target="_blank" rel="noopener noreferrer" >Twitter</a></li>
              </>
            :
            <>
            </>
            }
            { this.state.wechat ? 
              <>
                <li><a href={this.state.wechat} target="_blank" rel="noopener noreferrer" >WeChat</a></li>
              </>
            :
            <>
            </>
            }
          </ul>
          <button onClick={this.VoteCandidate} className="btn">Vote for {this.state.name}</button>
          </div>
      </div>
    );
  }
}

export default withRouter(CandidateSingle);
