import React from 'react';

import '../App.css';

class About extends React.Component {
  render() {
    return (
      <div className="home main-content">
        <h1>About</h1>
        <p>
          The Office of Inspector General (OIG) is a watchdog agency for the WAX network 
          with the mission of evaluating WAX Guilds using an evolving heuristic. The OIG determines 
          which service providers are best suited to operate the network based on competence, 
          value add, and other metrics. The OIG is staffed by a committee of 3 elected members who publish
          a rating report ranking the Guilds on a monthly basis. The ratings can be used by WAX token holders to make 
          voting decisions. The aggregated WAX votes determine the rank of Guilds in the block production rotation. 
          The top 21 ranked Guilds are the "active" block producers and the rest passing minimum requirements are "standby." 
          Among the responsibilities of the OIG is overseeing and ensuring the continued evolution of the evaluations framework
           to improve Guild rating accuracy, identify and remove operational inefficiencies, and promote healthy competition among Guilds.
        </p>
      </div>
    );
  }
}

export default About;
