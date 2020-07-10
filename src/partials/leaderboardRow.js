import React from 'react';
import {
  Link
} from "react-router-dom";
import * as waxjs from "@waxio/waxjs/dist";

import '../App.css';

const wax = new waxjs.WaxJS('https://testnet.waxsweden.org', null, null, false);

class leaderboardRow extends React.Component {
	constructor(props){
        super(props);
        console.log(this.props); // prints out whatever is inside props

    }

	render(){
		return (
			<tr key={this.props.data.key} >
                <td>{this.props.data.index + 1}</td>
                <td><Link to={"/candidates/" + this.props.data.key}>{this.state.name}</Link></td>
                <td>{this.props.data.key}</td>
                <td><span className="vote-count">{this.props.data.value}S</span></td>
                <td><button value={this.props.data.key} onClick={this.castVote} className="btn">Vote</button></td>
            </tr>
		)
	}
}

export default leaderboardRow();