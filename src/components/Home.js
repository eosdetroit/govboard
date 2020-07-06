import React from 'react';
import {
  Redirect
} from "react-router-dom";

import '../App.css';

class Home extends React.Component {
  render() {
  if (this.props.activeUser != null) {
        
        return (
                <>
                <Redirect to='/candidates' />
                </>
                )
    }
    return (
      <div className="home main-content">
        <h1>Overview</h1>
        <br></br>
        <p>
          The Office of Inspector General (OIG) is a watchdog agency for the WAX network 
          with the mission of evaluating WAX Guilds using an evolving heuristic. The OIG determines 
          which service providers are best suited to operate the network based on competence, 
          value add, and other metrics. The OIG is staffed by a committee of 3 elected inspector generals (IGs)
          who publish a rating report ranking the Guilds on a monthly basis. The ratings can be used by WAX 
          token holders to make voting decisions. The aggregated WAX votes determine the rank of Guilds in 
          the block production rotation. The top 21 ranked Guilds are the "active" block producers, rank 22 
          and higher Guilds that are passing minimum requirements are "standby." Among the responsibilities 
          of the OIG is overseeing and ensuring the continued evolution of the evaluations framework to 
          improve Guild rating accuracy, identify and remove operational inefficiencies, and promote healthy 
          competition among Guilds.
        </p>
        <br></br>
        <h1>OIG Election Process</h1>
        <br></br>
        <p>
          The OIG was started by 3 WAX-appointed inspector generals that currently serve the office. 
          Each Appointed IG is slated to serve at minimum a 9 month tenure; July 2020 will be the 9th OIG 
          Report, and thus time to start rotating in Elected IGs using a stake-weighted voting system. 
          Appointed IGs will leave office on a 3 month rolling basis, and be replaced by Elected IGs who
          will serve an 18 month tenure and be put up for election on a 6 month rolling basis. There is 
          one caveat in that an Interim IG needs to be elected to serve a 9 month term in order to migrate 
          to the 18 month schedule.
        </p>
        <br></br>

        <h1>Election Timeline</h1>
        <br></br>
        <p>
          <b>July 13 2020:</b> Begin Candidate Nominations
          <br></br>
          <b>July 20 2020:</b> End Nominations and Begin Election Period
          <br></br>
          <b>July 31 2020:</b> Election Period Ends and Elected IG
          <br></br>
          <b>November 2020:</b> Appointed IG Replaced with Interim IG
          <br></br>
          <b>February 2021:</b> Appointed IG Replaced with Elected IG
          <br></br>
          <b>August 2021:</b> Interim IG Replaced with Elected IG
        </p>
      </div>
    );
  }
}

export default Home;
