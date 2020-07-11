import React from 'react';
import {
  Redirect,
  Link
} from "react-router-dom";

import '../App.css';
import SimpleReactValidator from 'simple-react-validator';
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
      picture: '',
      description: '',
      twitter: '',
      wechat: '',
      telegram: '',

  	};
    this.validator = new SimpleReactValidator();
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
      			isNominated: true,
            hasAccepted: resp.rows[resp.rows.length - resp.rows.length].accepted
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
            if (nomineeInfo.rows !== ''){
            this.setState({
		          name: nomineeInfo.rows[nomineeInfo.rows.length - nomineeInfo.rows.length].name,
              picture: nomineeInfo.rows[nomineeInfo.rows.length - nomineeInfo.rows.length].picture,
              description: nomineeInfo.rows[nomineeInfo.rows.length - nomineeInfo.rows.length].descriptor,
              telegram: nomineeInfo.rows[nomineeInfo.rows.length - nomineeInfo.rows.length].telegram,
              twitter: nomineeInfo.rows[nomineeInfo.rows.length - nomineeInfo.rows.length].twitter,
              wechat: nomineeInfo.rows[nomineeInfo.rows.length - nomineeInfo.rows.length].wechat,
      			});
            }
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
  	if (this.validator.allValid()) {
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
            picture: this.state.picture,
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
  } else {
      this.validator.showMessages();
        // rerender to show messages for the first time
        // you can use the autoForceUpdate option to do this automatically`
      this.forceUpdate();
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
      			<button onClick={this.acceptNomination} className="btn accept">Accept</button>
            <button onClick={this.declineNomination} className="btn decline">Decline</button>
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
          <p>Note: You will not appear on the candidate list until you submit your initial candidate details. You can return to this page to update your details at any time during the nomination period.</p>
  				<div className="form-row">
            <label for="name">Full Name<span className="required">*</span></label>
            <input type="text" name="name" value={this.state.name} maxlength="99" required onBlur={() => this.validator.showMessageFor('name')} placeholder="John Doe" onChange={this.handleInputChange} />
            {this.validator.message('name', this.state.name, 'required|alpha_space|max:99')}
        </div>
          <div className="form-row">
  					<label for="picture">Picture<span className="required">*</span></label>
  					<input type="text" value={this.state.picture} placeholder="Url to image file on the web" maxlength="256" required onBlur={() => this.validator.showMessageFor('picture')} name="picture" onChange={this.handleInputChange} />
				    {this.validator.message('picture', this.state.picture, 'required|url|max:256')}
        </div>
				<div className="form-row">
  					<label for="description">Candidicy Platform<span className="required">*</span></label>
  					<textarea name="description" value={this.state.description} required maxlength="2000" onBlur={() => this.validator.showMessageFor('username')} onChange={this.handleInputChange}></textarea>
				    {this.validator.message('description', this.state.description, 'required|max:2000')}
        </div>
				<div className="form-row">
  					<label for="telegram">Telegram Handle</label>
  					<input type="text" name="telegram" value={this.state.telegram} maxlength="99" placeholder="@yourhandle" onChange={this.handleInputChange} />
				    {this.validator.message('telegram', this.state.telegram, 'max:99')}
        </div>
				<div className="form-row">
  					<label for="twitter">Twitter Profile</label>
  					<input type="text" name="twitter" value={this.state.twitter} maxlength="256" placeholder="http://twitter.com" onChange={this.handleInputChange} />
				    {this.validator.message('twitter', this.state.twitter, 'url|max:256')}
        </div>
				<div className="form-row">
  					<label for="wechat">WeChat Profile</label>
  					<input type="text" name="wechat" value={this.state.wechat} maxlength="256" placeholder="http://wechat.com" onChange={this.handleInputChange} />
				    {this.validator.message('wechat', this.state.wechat, 'url|max:256')}
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
    } else if (this.props.electionState === 0 || this.props.electionState === 1 || this.props.electionState === 5) {
      
      return (
        <div className="nomination main-content">
          <div className="nomination-header">
            <h2>Nominate</h2>
            <p>There is currently no election running. Please check the <Link to="/">home page</Link> for upcoming elections.</p>
          </div>
        </div>
      );
    } else if (this.props.electionState === 3 || this.props.electionState === 4) {
      
      return (
        <div className="nomination main-content">
          <div className="nomination-header">
            <h2>Nominate</h2>
            <p>The nomination period for the current election has closed. <Link to="/candidates">Vote</Link> for your favorite candidate now!</p>
          </div>
        </div>
      );

    } else if (this.props.electionState === 2) {
      
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
}

export default Nomination;
