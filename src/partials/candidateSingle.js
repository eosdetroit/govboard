import React from 'react';
import { BrowserRouter as Router,
  Switch,
  Route,
  Link, withRouter, useParams
} from "react-router-dom";
import * as waxjs from "@waxio/waxjs/dist";

import '../App.css';
import placeholder from '../assets/candidate-placeholder.jpg';

const wax = new waxjs.WaxJS('http://wax.greymass.com', null, null, false);

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
  }

  componentDidMount = () => {
    const owner = this.props.match.params.owner;
    this.fetchData(owner);
  }

  async fetchData(owner) {
     try {
      let resp = await wax.rpc.get_table_rows({             
            code: 'eosio',
            scope: 'eosio',
            table: 'producers',
            limit: 1,
            lower_bound: owner,
            upper_bound: owner,
            json: true
        });
        this.setState({
          nominee: resp.rows[resp.rows.length - resp.rows.length].owner,
          logo_256: '',
          description: '',
          website: '',
          telegram: '',
          twitter: '',
          wechat: ''
          });
          console.log(this.state);
          } catch(e) {
          console.log(e);
      }       // ...
  };

  async VoteCandidate(){
    try {
      const result = await wax.api.transact({
        actions: [{
          account: 'oig',
          name: 'castvote',
          authorization: [{
            actor: this.props.activeUser,
            permission: 'active',
          }],
          data: {
            voter: this.props.activeUser,
            nominee: this.state.nominee,
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
    } catch(e) {
      console.log(e);
    }
  }

  render() {
    return (
      <div className="candidate-single">
        <div className="candidate-header">
          <h2>{this.state.nominee}</h2>
          <span><i>Candidate for WAX OIG</i></span>
        </div>
        <div className="candidate-left-pane">
          <img src={placeholder} alt="" />
          {/* <img src={this.state.logo_256} alt="{this.state.nominee}" /> */}
        </div>
        <div className="candidate-right-pane">
          <p>{this.state.description}</p>
          <p>Additional Information: {this.state.website}</p>
          <strong>Social Media</strong>
          <ul>
            <li>Telegram: {this.state.telegram}</li>
            <li>Twitter: {this.state.twitter}</li>
            <li>WeChat: {this.state.wechat}</li>
          </ul>
          <button onClick={this.VoteCandidate}>Vote for {this.state.nomiee}</button>
          </div>
      </div>
    );
  }
}

export default withRouter(CandidateSingle);
