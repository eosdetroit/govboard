import React from 'react';
import {
  Redirect,
  Link
} from "react-router-dom";

import '../App.css';
import SimpleReactValidator from 'simple-react-validator';
import * as waxjs from "@waxio/waxjs/dist";


//WAX_RPC_URL = 'https://testnet.waxsweden.org'
const WAX_RPC_URL = 'https://wax.greymass.com'
const wax = new waxjs.WaxJS(WAX_RPC_URL, null, null, false);


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
        if (Array.isArray(resp.rows) && resp.rows.length === 0){

      	} else {
      		this.setState({
      			isNominated: true,
            hasAccepted: resp.rows[0].accepted
          });
          
      		if (resp.rows[0].accepted === 1) {
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
            if (Array.isArray(nomineeInfo.rows) && nomineeInfo.rows.length !== 0) {
                const name = 'name' in nomineeInfo.rows[0] ? nomineeInfo.rows[0].name : '';
                const picture = 'picture' in nomineeInfo.rows[0] ? nomineeInfo.rows[0].picture : '';
                const description = 'descriptor' in nomineeInfo.rows[0] ? nomineeInfo.rows[0].descriptor : '';
                const telegram = 'telegram' in nomineeInfo.rows[0] ? nomineeInfo.rows[0].telegram : '';
                const twitter = 'twitter' in nomineeInfo.rows[0] ? nomineeInfo.rows[0].twitter : '';
                const wechat = 'wechat' in nomineeInfo.rows[0] ? nomineeInfo.rows[0].wechat : '';
              this.setState({
                name: name,
                picture: picture,
                description: description,
                telegram: telegram,
                twitter: twitter,
                wechat: wechat,
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
      await this.state.activeUser.signTransaction(
        transaction, {blocksBehind: 3,
        expireSeconds: 30
      });
      if (this.state.nominee === this.props.activeUser.accountName) {
        this.setState({
          isNominated: true,
          hasAccepted: 1
        });
      }
      document.getElementById('nomform').innerHTML = 'You successfully nominated a candidate!';
      let nomform = document.getElementById('nomform');
      nomform.classList.add("success");
      nomform.classList.remove("error");
      nomform.innerHTML = 'You successfully nominated a candidate!';    
    } catch(e) {
      let nomform = document.getElementById('nomform');
      nomform.classList.add("error");
      nomform.classList.remove("success");
      nomform.innerHTML = e; 
    }
  }

  async acceptNomination() {
  	try {
      const transaction = {
        actions: [{
          account: 'oig',
          name: 'proclaim',
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
      await this.state.activeUser.signTransaction(
        transaction, {blocksBehind: 3,
        expireSeconds: 30
      });
      this.setState({
        isNominated: true,
        hasAccepted: 1
      });
      let nomlist = document.getElementById('nomlist');
      nomlist.classList.add("success");
      nomlist.classList.remove("error");
      nomlist.innerHTML = 'You have accepted the nomination!';    
      } catch(e) {
      let nomlist = document.getElementById('nomlist');
      nomlist.classList.add("error");
      nomlist.classList.remove("success");
      nomlist.innerHTML = e;
    }
  }

  async declineNomination() {
  	try {
      const transaction = {
        actions: [{
          account: 'oig',
          name: 'proclaim',
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
      await this.state.activeUser.signTransaction(
        transaction, {blocksBehind: 3,
        expireSeconds: 30
      });
      this.setState({
        isNominated: false,
        hasAccepted: 0
      });
      let nomlist = document.getElementById('nomlist');
      nomlist.classList.add("success");
      nomlist.classList.remove("error");
      nomlist.innerHTML = 'You have declined the nomination!';
      document.getElementById('nomform').innerHTML = '';
    } catch(e) {
      let nomlist = document.getElementById('nomlist');
      nomlist.classList.add("error");
      nomlist.classList.remove("success");
      nomlist.innerHTML = e;
    }
  }

  async updateNominee() {
  	if (this.validator.allValid()) {
    try {
      const transaction = {
        actions: [{
          account: 'oig',
          name: 'nominf',
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
      await this.state.activeUser.signTransaction(
        transaction, {blocksBehind: 3,
        expireSeconds: 30
      });
      let updatenom = document.getElementById('updatenom');
      updatenom.classList.add("success");
      updatenom.classList.remove("error");
      updatenom.innerHTML = 'You have updated your nomination info!';
    } catch(e) {
      let updatenom = document.getElementById('updatenom');
      updatenom.classList.add("success");
      updatenom.classList.remove("error");
      updatenom.innerHTML = 'You have updated your nomination info!';
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
            }), () => { }
        );
    }

  componentDidMount() {
    if (this.props.electionState === 2){
      return this.checkNominations();
    } else {
      
    }
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
            <div id="nomform"></div>
          </div>
        </div>
      );
  }

  hasAccepted() {
  	if (this.state.hasAccepted === 1){
  		return (
  			<div className="nomination-info-form">
	  			<h3>Submit or Update Candidacy Information</h3>
          <p>Note: You will not appear on the candidate list until you submit your initial candidate details. You can return to this page to update your details at any time during the nomination period.</p>
  				<div className="form-row">
            <label htmlFor="name">Full Name<span className="required">*</span></label>
            <input type="text" name="name" value={this.state.name} maxLength="99" required onBlur={() => this.validator.showMessageFor('name')} placeholder="John Doe" onChange={this.handleInputChange} />
            {this.validator.message('name', this.state.name, 'required|alpha_space|max:99')}
        </div>
          <div className="form-row">
  					<label htmlFor="picture">Picture<span className="required">*</span></label>
  					<input type="text" value={this.state.picture} placeholder="Url to image file on the web" maxLength="256" required onBlur={() => this.validator.showMessageFor('picture')} name="picture" onChange={this.handleInputChange} />
				    <i>Please use a square image (i.e. 250x250) for best results</i>
            {this.validator.message('picture', this.state.picture, ['required' , {regex: /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/, max: 256}])}
        </div>
				<div className="form-row">
  					<label htmlFor="description">Candidacy Platform<span className="required">*</span></label>
  					<textarea name="description" value={this.state.description} required maxLength="2000" onBlur={() => this.validator.showMessageFor('username')} onChange={this.handleInputChange}></textarea>
				    {this.validator.message('description', this.state.description, 'required|max:2000')}
        </div>
				<div className="form-row">
  					<label htmlFor="telegram">Telegram Handle</label>
  					<input type="text" name="telegram" value={this.state.telegram} maxLength="99" placeholder="@yourhandle" onChange={this.handleInputChange} />
				    {this.validator.message('telegram', this.state.telegram, 'max:99')}
        </div>
				<div className="form-row">
  					<label htmlFor="twitter">Twitter Profile</label>
  					<input type="text" name="twitter" value={this.state.twitter} maxLength="256" placeholder="http://twitter.com" onChange={this.handleInputChange} />
				    {this.validator.message('twitter', this.state.twitter, 'url|max:256')}
        </div>
				<div className="form-row">
  					<label htmlFor="wechat">WeChat Profile</label>
  					<input type="text" name="wechat" value={this.state.wechat} maxLength="256" placeholder="@yourhandle" onChange={this.handleInputChange} />
				    {this.validator.message('wechat', this.state.wechat, 'url|max:256')}
        </div>
				<button onClick={this.updateNominee} className="btn">Submit</button>
        <div className="error" id="updatenom"></div>
  			</div>
		);
  	}
  }


  render() {
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
            <div id="nomlist"></div>
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
