import React from 'react';
import { BrowserRouter as Router,
  Switch,
  Route,
  Link, withRouter, useParams
} from "react-router-dom";
import * as waxjs from "@waxio/waxjs/dist";

import '../App.css';

const wax = new waxjs.WaxJS('http://wax.greymass.com', null, null, false);

class CandidateSingle extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      name: ''
    }
  }

  componentDidMount = () => {
    const owner = this.props.match.params.owner;
    console.log(this.props.match.params.owner);
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
          name: resp.rows[resp.rows.length - resp.rows.length].owner
          });
          console.log(this.state);
          } catch(e) {
          console.log(e);
      }       // ...
  };


  render() {
    return (
      <div className="candidateSingle">
      <div>{this.state.name} asdsadsa</div>
      </div>
    );
  }
}

export default withRouter(CandidateSingle);
