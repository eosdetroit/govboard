import React from 'react';
import oigLogo from '../assets/waxOIGTransparent-small.png';
import '../App.css';

class Home extends React.Component {

  render() {
    return (
      <div className="home main-content" id="main">
        <div className="badge"><img className="oigLogo" src={oigLogo} alt="WAX OIG Logo" /></div>
        <div className="bodyText">
          <h1>OIG Election Process</h1>
          <br />
          <p>
            The OIG was started by 3 WAX-appointed inspector generals that currently serve the office. 
            Each Appointed IG is slated to serve at minimum a 9 month tenure; July 2020 will be the 9th OIG 
            Report, and thus time to start rotating in Elected IGs using a stake-weighted voting system. 
            Appointed IGs will leave office on a 3 month rolling basis, and be replaced by Elected IGs who
            will serve an 18 month tenure and be put up for election on a 6 month rolling basis. There is 
            one caveat in that an Interim IG needs to be elected to serve a 9 month term in order to migrate 
            to the 18 month schedule.
          </p>
          <br />
          <p>
            Each OIG election consists of a nomination phase, where nominees can accept or decline, and provide additional
            information. This is followed by a voting phase, where WAX token holders can vote on one OIG candidate. After 
            the voting phase is concluded, the winner will be determined as the candidate with the most votes on the ballot.
          </p>
          <br />

          <h1>Current Election Timeline</h1>
          <br />
          <p>
            <strong>October 1st, 2020 - 0:00 UTC:</strong> Begin candidate nominations.
            <br />
            <strong>October 11th, 2020 - 0:00 UTC:</strong> End nominations and begin election period.
            <br />
            <strong>October 15th, 2020 - 23:59:59 UTC</strong> Election period ends.
            <br />
            <strong>October 16th, 2020:</strong> Newly Elected IG begins transition work with Appointed IG.
            <br />
            <strong>November 1st, 2020:</strong> Appointed IG replaced with Elected IG.
          </p>
         <br />
          <h1>Future Election Schedule</h1>
          <br />
          <p>
            <b>January 2021:</b> Election period to determine Elected IG.
            <br />
            <b>February 1 2021:</b>Final Appointed IG replaced with Elected IG.
            <br />
            <b>July 2021:</b> Election period to replace first Elected IG.
            <br />
            <b>August 1 2021:</b> First Elected IG replaced with new Elected IG.
          </p>
        </div>
      </div>
    );
  }
}

export default Home;
