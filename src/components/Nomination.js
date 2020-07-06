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
  		activeUser: this.props.activeUser,
  		isNominated: '',
  		hasAccepted: false,
      nominee: '',
      name: '',
      logo_256: '',
      description: '',
      twitter: '',
      wechat: '',
      telegram: '',

  	};
    this.nominateCandidate = this.nominateCandidate.bind(this);
    this.acceptNomination = this.acceptNomination.bind(this);
    this.declineNomination = this.declineNomination.bind(this);
    this.updateNominee = this.updateNominee.bind(this);
  }

  async checkNominations() {
  	try {
        let resp = await wax.rpc.get_table_rows({             
            code: 'oig',
            scope: 'oig',
            table: 'nominations',
            limit: 1,
            lower_bound: this.props.accountName,
            upper_bound: this.props.accountName,
            json: true
        });
        if (resp.rows === ''){
      	} else {
      		this.setState({
      			isNominated: true
      		});
      		if (resp.rows[resp.rows.length - resp.rows.length].accepted === 1){
      			let nomineeInfo = await wax.rpc.get_table_rows({ 
              code: 'oig',
              scope: 'oig',
              table: 'nominees',
              limit: 1,
              lower_bound: this.props.accountName,
              upper_bound: this.props.accountName,
              json: true
            });
            console.log(nomineeInfo);
            this.setState({
		          name: nomineeInfo.rows[nomineeInfo.rows.length - nomineeInfo.rows.length].name,
              logo_256: nomineeInfo.rows[nomineeInfo.rows.length - nomineeInfo.rows.length].logo_256,
              description: nomineeInfo.rows[nomineeInfo.rows.length - nomineeInfo.rows.length].descriptor,
              telegram: nomineeInfo.rows[nomineeInfo.rows.length - nomineeInfo.rows.length].telegram,
              twitter: nomineeInfo.rows[nomineeInfo.rows.length - nomineeInfo.rows.length].twitter,
              wechat: nomineeInfo.rows[nomineeInfo.rows.length - nomineeInfo.rows.length].wechat,
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
    console.log(this.state.nominee);
    const transaction = {
      actions: [{
          account: 'oig',
          name: 'nominate',
          authorization: [{
            actor: this.state.activeUser.accountName,
            permission: 'active',
          }],
          data: {
            nominator: this.state.activeUser.accountName,
            nominee: this.state.nominee,
          },
      }]
    } 
    try {
      const result = await this.state.activeUser.signTransaction(
        transaction, {blocksBehind: 3,
        expireSeconds: 30
      });
      console.log(result);
    } catch(e) {
      console.log(e);
    }
  }

  async acceptNomination() {
  	try {
      const transaction = {
        actions: [{
          account: 'oig',
          name: 'decide',
          authorization: [{
            actor: this.props.accountName,
            permission: 'active',
          }],
          data: {
            nominee: this.props.accountName,
            decision: true,
          },
        }]
      }
      const result = await this.state.activeUser.signTransaction(
        transaction, {blocksBehind: 3,
        expireSeconds: 30
      });
      console.log(result);
    } catch(e) {
      console.log(e);
    }
  }

  async declineNomination() {
  	try {
      const transaction = {
        actions: [{
          account: 'oig',
          name: 'decide',
          authorization: [{
            actor: this.props.accountName,
            permission: 'active',
          }],
          data: {
            nominee: this.props.accountName,
            decision: false,
          },
        }]
      }
      const result = await this.state.activeUser.signTransaction(
        transaction, {blocksBehind: 3,
        expireSeconds: 30
      });
      console.log(result);
    } catch(e) {
      console.log(e);
    }
  }

  async updateNominee() {
  	try {
      const transaction = {
        actions: [{
          account: 'oig',
          name: 'update',
          authorization: [{
            actor: this.props.accountName,
            permission: 'active',
          }],
          data: {
            nominee: this.props.accountName,
            name: this.state.name,
            logo_256: this.state.logo_256,
            descriptor: this.state.description,
            telegram: this.state.telegram,
            twitter: this.state.twitter,
            wechat: this.state.wechat,
            remove: false
          },
        }]
      }
      const result = await this.state.activeUser.signTransaction(
        transaction, {blocksBehind: 3,
        expireSeconds: 30
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
      			<h3>{this.props.accountName}'s Nomination Status</h3>
      			<p>Someone has nominated you for a WAX Office of the Inspector General position!</p>
      			<button onClick={this.acceptNomination} className="btn">Accept</button>
            <button onClick={this.declineNomination} className="btn accept">Decline</button>
      		</div>
  		);
  	} else if (this.state.isNominated === true && this.state.hasAccepted === 1) {
  		return (
  			<div className="nomination-list">
      			<h3>{this.props.accountName}'s Nomination Status</h3>
      			<p>You've accepted your nomination. If you would like to change your mind, click decline below.</p>
      			<button onClick={this.declineNomination} className="btn decline">Decline</button>
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

  nominationForm() {
    return (
        <div className="nomination-form">
          <div className="form-row">
            <h3>Nominate a Candidate</h3>
            <p>Enter the WAX account name of the person you would like to nominate.</p>
            <input type="text" name="nominee" className="inline-input" placeholder="Nominee's WAX account name" onChange={this.handleInputChange} />
            <button onClick={this.nominateCandidate} className="btn inline-btn">Nominate</button>
          </div>
        </div>
      );
  }

  hasAccepted() {
  	if (this.state.hasAccepted === 1){
  		return (
  			<div className="nomination-info-form">
	  			<h3>Submit or Update Candidicy Information</h3>
  				<div className="form-row">
            <label for="name">Full Name</label>
            <input type="text" name="name" value={this.state.name} maxlength="256" placeholder="John Doe" onChange={this.handleInputChange} />
        </div>
          <div className="form-row">
  					<label for="logo_256">Picture</label>
  					<input type="text" value={this.state.logo_256} placeholder="Url to image file on the web" name="logo_256" onChange={this.handleInputChange} />
				</div>
				<div className="form-row">
  					<label for="description">Candidicy Platform</label>
  					<textarea name="description" value={this.state.description} maxlength="2000" onChange={this.handleInputChange}></textarea>
				</div>
				<div className="form-row">
  					<label for="telegram">Telegram Handle</label>
  					<input type="text" name="telegram" value={this.state.telegram} maxlength="99" placeholder="@yourhandle" onChange={this.handleInputChange} />
				</div>
				<div className="form-row">
  					<label for="twitter">Twitter Profile</label>
  					<input type="text" name="twitter" value={this.state.twitter} maxlength="256" placeholder="http://twitter.com" onChange={this.handleInputChange} />
				</div>
				<div className="form-row">
  					<label for="wechat">WeChat Profile</label>
  					<input type="text" name="wechat" value={this.state.wechat} maxlength="256" placeholder="http://wechat.com" onChange={this.handleInputChange} />
				</div>
				<button onClick={this.updateNominee} className="btn">Submit</button>
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
        <div className="nomination-header">
          <h2>Nominate</h2>
        </div>
        <div className="nomination-left-pane">
          {this.isNominated()}
          {this.nominationForm()}
        </div>
        <div className="nomination-right-pane">
        {this.hasAccepted()}
        </div>
      </div>
    );
  }
}

export default Nomination;
