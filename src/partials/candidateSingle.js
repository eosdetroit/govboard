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
      console.log(result);
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
                <li><a href={this.state.twitter} target="_blank" >Twitter</a></li>
              </>
            :
            <>
            </>
            }
            { this.state.wechat ? 
              <>
                <li><a href={this.state.wechat} target="_blank" >WeChat</a></li>
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
