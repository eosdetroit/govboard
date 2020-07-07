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
          <b>July 13 2020:</b> Begin candidate nominations.
          <br></br>
          <b>July 20 2020:</b> End nominations and begin election period.
          <br></br>
          <b>July 31 2020:</b> Election period ends.
          <br></br>
          <b>August 1 2020:</b> Appointed IG replaced with Elected IG.
          <br></br>
          <b>November 2020:</b> Election period to determine Interim IG.
          <br></br>
          <b>December 1 2020:</b> Appointed IG replaced with Elected Interim IG.
          <br></br>
          <b>February 2021:</b> Election period to determine Elected IG.
          <br></br>
          <b>March 1 2021:</b> Appointed IG replaced with Elected IG.
          <br></br>
          <b>August 2021:</b> Election period with Elected IG.
          <br></br>
          <b>September 1 2021:</b> Interim IG replaced with Elected IG.
        </p>
      </div>
    );
  }
}

export default Home;
