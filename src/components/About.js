/** @jsx jsx */

import React from 'react';

import { jsx } from '@emotion/react';
import * as GLOBAL_STYLE from '../theme';

import oigLogo from '../assets/waxOIGTransparent-small.png';

class About extends React.Component {
    render() {
        return (
            <div
                css={{
                    padding: `${GLOBAL_STYLE.spacing.l} ${GLOBAL_STYLE.spacing.s}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    '& .oigLogo': {
                        width: '60vw',
                        maxWidth: 450,
                        marginBottom: GLOBAL_STYLE.spacing.m,
                        [GLOBAL_STYLE.mediaQuery.largeMobileUp]: {
                            width: '30vw',
                        }
                    }
                }}
            >
                <img className="oigLogo" src={oigLogo} alt="WAX OIG Logo" />
                <div>
                    <GLOBAL_STYLE.H3>The Office of Inspector General (OIG)</GLOBAL_STYLE.H3>
                    <GLOBAL_STYLE.P>
                        The OIG is a watchdog agency for the WAX network staffed by a committee of 3 elected inspector
                        generals (IGs) who publish a rating report ranking the Guilds on a monthly basis.
                    </GLOBAL_STYLE.P>
                    <GLOBAL_STYLE.H5>How is this ranking report relevant?</GLOBAL_STYLE.H5>
                    <GLOBAL_STYLE.P>
                        The ratings can be used by WAX token holders to make voting decisions. The aggregated WAX votes
                        determine the rank of Guilds in the block production rotation. The top 21 ranked Guilds are the
                        "active" block producers, rank 22 and higher Guilds that are passing minimum requirements are
                        "standby."
                    </GLOBAL_STYLE.P>
                    <GLOBAL_STYLE.H4>Our mission</GLOBAL_STYLE.H4>
                    <GLOBAL_STYLE.P>
                        Evaluate WAX Guilds using an evolving heuristic. The OIG determines which service providers are best
                        suited to operate the network based on competence, value add, and other metrics.{' '}
                    </GLOBAL_STYLE.P>
                    <GLOBAL_STYLE.H4>Responsibilities</GLOBAL_STYLE.H4>
                    <GLOBAL_STYLE.P>
                        Among the responsibilities of the OIG is overseeing and ensuring the continued evolution of the
                        evaluations framework to improve Guild rating accuracy, identify and remove operational
                        inefficiencies, and promote healthy competition among Guilds.
                    </GLOBAL_STYLE.P>
                </div>
            </div>
        );
    }
}

export default About;
