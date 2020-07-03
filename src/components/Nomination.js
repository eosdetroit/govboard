import React from 'react';
import {
  Redirect
} from "react-router-dom";

import '../App.css';
import * as waxjs from "@waxio/waxjs/dist";

const wax = new waxjs.WaxJS('https://testnet.waxsweden.org', null, null, false);

class Nomination extends React.Component {
  constructor(props){
  	super(props);
  	this.state = {
  		activeUser: [this.props.activeUser],
  		isNominated: '',
  		hasAccepted: false
  	}
  }

  async checkNominations() {
  	try {
        let resp = await wax.rpc.get_table_rows({             
            code: 'oigoigoigoig',
            scope: 'oigoigoigoig',
            table: 'nominations',
            limit: 1,
            lower_bound: this.props.accountName,
            upper_bound: this.props.accountName,
            json: true
        });
        console.log(resp.rows);
        if (resp.rows === ''){
      		console.log('No nominations!');
      	} else {
      		this.setState({
      			isNominated: true
      		});
      		if (resp.rows[resp.rows.length - resp.rows.length].accepted === 1){
      			this.setState({
      				hasAccepted: resp.rows[resp.rows.length - resp.rows.length].accepted
      			});
      		}
      		console.log(this.state);
      	}
        } catch(e) {
          console.log(e);
      }     
  }

  async nominateCandidate() {
  	try {
      const result = await wax.api.transact({
        actions: [{
          account: 'oigoigoigoig',
          name: 'nominate',
          authorization: [{
            actor: this.props.accountName,
            permission: 'active',
          }],
          data: {
            nominator: this.props.accountName,
            nomination: this.state.nominee,
          },
        }],
        blocksBehind: 3,
        expireSeconds: 30,
      });
      console.log(result);
    } catch(e) {
      console.log(e);
    }
  }

  async acceptNomination() {
  	try {
      const result = await wax.api.transact({
        actions: [{
          account: 'oigoigoigoig',
          name: 'decide',
          authorization: [{
            actor: this.props.accountName,
            permission: 'active',
          }],
          data: {
            nominee: this.props.accountName,
            decision: 1,
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

  async declineNomination() {
  	try {
      const result = await wax.api.transact({
        actions: [{
          account: 'oigoigoigoig',
          name: 'decide',
          authorization: [{
            actor: this.props.accountName,
            permission: 'active',
          }],
          data: {
            nominee: this.props.accountName,
            decision: 0,
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

  async updateNominee() {
  	try {
      const result = await wax.api.transact({
        actions: [{
          account: 'oigoigoigoig',
          name: 'update_nominee',
          authorization: [{
            actor: this.props.accountName,
            permission: 'active',
          }],
          data: {
            nominee: this.props.accountName,
          	logo_256: this.state.logo_256,
          	description: this.state.description,
          	website: this.state.website,
          	telegram: this.state.telegram,
          	twitter: this.state.twitter,
          	wechat: this.state.wechat
          },
        }],
        blocksBehind: 3,
        expireSeconds: 30,
      });
      console.log(result);
    } catch(e) {
      console.log(e);
    }
  }

  handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState(prevState => ({
            [name]: value,
            }), () => { console.log(this.state) }
        );
    }

  componentDidMount() {
  	return this.checkNominations();
  }

  isNominated() {
  	if (this.state.isNominated === true && this.state.hasAccepted === 0) {
  		return (
  			<div className="nomination-list">
      			<h3>{this.props.accountName}'s Nominations</h3>
      			<p>Someone has nominated you for a WAX Office of the Inspector General position!</p>
      			<button onClick={this.acceptNomination}>Accept</button>
            <button onClick={this.declineNomination}>Decline</button>
      		</div>
  		);
  	} else if (this.state.isNominated === true && this.state.hasAccepted === 1) {
  		return (
  			<div className="nomination-list">
      			<h3>{this.props.accountName}'s Nominations</h3>
      			<p>You've accepted your nomination. If you would like to change your mind, click decline below.</p>
      			<button onClick={this.declineNomination}>Decline</button>
      		</div>
  		);
  	} else {
  		return (
  			<div className="nomination-list">
          		<h3>{this.props.accountName}'s Nominations</h3>
          		<p>You are not currently nominated for a WAX office of the Inspector General position. You can nominate yourself or someone else below.</p>
          	</div>
  		);
  	}
      
  }

  hasAccepted() {
  	if (this.state.hasAccepted === 1){
  		return (
  			<div className="nomination-info-form">
	  			<h3>Submit or Update Candidicy Information</h3>
  				<div className="form-row">
  					<label for="logo_256">Picture</label>
  					<input type="upload" name="logo_256" onChange={this.handleInputChange} />
				</div>
				<div className="form-row">
  					<label for="description">Candidicy Platform</label>
  					<textarea name="description" onChange={this.handleInputChange}></textarea>
				</div>
				<div className="form-now">
  					<label for="website">Website or Announcement</label>
  					<input type="text" name="website" onChange={this.handleInputChange} />
				</div>
				<div className="form-now">
  					<label for="telegram">Telegram Handle</label>
  					<input type="text" name="telegram" onChange={this.handleInputChange} />
				</div>
				<div className="form-now">
  					<label for="twitter">Twitter Profile</label>
  					<input type="text" name="twitter" onChange={this.handleInputChange} />
				</div>
				<div className="form-now">
  					<label for="wechat">WeChat Profile</label>
  					<input type="text" name="wechat" onChange={this.handleInputChange} />
				</div>
				<button onClick={this.updateNominee}>Submit</button>
  			</div>
		);
  	}
  }


  render() {
  	console.log(this.props.activeUser);
  	if (this.props.activeUser === null) {
        
        return (
                <>
                <Redirect to='/' />
                </>
                )
    }  		
    return (	
      <div className="nomination main-content">
        <h2>Nominate</h2>
        {this.isNominated()}
        {this.hasAccepted()}
    	  <div className="nomination-form">
			  <h3>Nominate for election</h3>
			    <div className="form-row">
            <label for="nominee">Nominee</label>
            <input type="text" name="nominee" placeholder="Nominee's WAX account name" onChange={this.handleInputChange} />
    		    <button onClick={this.nominateCandidate}>Nominate Candidate</button>
    	    </div>
        </div>
      </div>
    );
  }
}

export default Nomination;
