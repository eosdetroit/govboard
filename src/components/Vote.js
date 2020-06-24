import React from 'react';
import {
  Link
} from "react-router-dom";
import * as waxjs from "@waxio/waxjs/dist";

import CandidateGrid from "../partials/candidate-grid-template.js";

import '../App.css';

const wax = new waxjs.WaxJS('https://wax.greymass.com', null, null, false);

class Vote extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      candidates: [],
    };
    this.GetCandidates = this.GetCandidates.bind(this);
  }

  async GetCandidates(){
      try {
        const resp = await wax.rpc.get_table_rows({
          json: true,              // Get the response as json
          code: 'eosio',     // Contract that we target
          scope: 'eosio',         // Account that owns the data
          table: 'producers',        // Table name
          limit: 50,               // Maximum number of rows that we want to get
          reverse: false,         // Optional: Get reversed data
          show_payer: false,      // Optional: Show ram payer
        });
        this.setState({
          candidates: resp.rows
        });
      } catch(e) {
        console.log(e);
      }
    }

  componentWillMount(){
    return this.GetCandidates();
  }

  render() {
    return (
      <div className="vote main-content">
          {this.state.candidates.map((candidate, key) =>
              <CandidateGrid data={candidate} key={candidate} />)}
      </div>
    );
  }
}

export default Vote;
