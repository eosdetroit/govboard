/** @jsx jsx */

import React from 'react';
import Crest from '../assets/crest.svg';
import Hive from '../assets/hive.svg';
import Bees from '../assets/bees.svg';
import BeePack from '../assets/bee-pack.svg';
import ItemPolygon from '../assets/itemPolygon.svg';
import oigLogo from '../assets/waxOIGTransparent-small.png';

import { jsx } from '@emotion/react';
import * as GLOBAL_STYLE from '../theme';
import IGinfo from './IGInfo';

class Home extends React.Component {

    render() {
        return (
            <div id="main"
                css={{
                    padding: `${GLOBAL_STYLE.spacing.l} 0`,
                }}
            >
                <div
                    css={{
                        minHeight: '80vh',
                        backgroundImage: `url(${Hive})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'contain',
                        backgroundPositionX: '-40px',
                        position: 'relative',
                        [GLOBAL_STYLE.mediaQuery.tabletUp]: {
                            minHeight: '100vh',
                        },
                        '& .headline': {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        },
                        '& .crest': {
                            marginRight: GLOBAL_STYLE.spacing.s,
                            marginLeft: GLOBAL_STYLE.spacing.s,
                            width: '80vw',
                            maxWidth: 1024,
                            objectFit: 'contain',
                        },
                        '& .bees': {
                            display: 'none',
                            [GLOBAL_STYLE.mediaQuery.tabletLandscapeUp]: {
                                display: 'block',
                                position: 'absolute',
                                right: GLOBAL_STYLE.spacing.s,
                                top: '0',
                            },
                        },
                        '& .headlineTitle, & .headlineParagraph': {
                            textAlign: 'center',
                            marginRight: GLOBAL_STYLE.spacing.s,
                            marginLeft: GLOBAL_STYLE.spacing.s,
                        },
                        '& .nextElection': {
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            margin: `${GLOBAL_STYLE.spacing.xxl} ${GLOBAL_STYLE.spacing.s}`,
                        },
                        '& .beePack': {
                            height: 90,
                            objectFit: 'contain',
                            [GLOBAL_STYLE.mediaQuery.largeMobileUp]: {
                                height: 150,
                            }
                        },
                        '& .nextElectionDate': {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        },
                        '& .electionDateHeadline': {
                            fontWeight: 400,
                            marginBottom: GLOBAL_STYLE.spacing.xxs,
                            textAlign: 'center',
                        },
                        '& .electionMonth': {
                            marginTop: '0',
                            textAlign: 'center',
                        },
                    }}
                >
                    <div className="headline">
                        <img src={Crest} className="crest" alt="WAX Office of Inspector General crest." />
                        <GLOBAL_STYLE.H1 className="headlineTitle">
                            A watchdog agency for the WAX network
                        </GLOBAL_STYLE.H1>
                        <GLOBAL_STYLE.P className="headlineParagraph">
                            evaluating WAX Guilds using an evolving heuristics.
                        </GLOBAL_STYLE.P>
                        <div className="nextElection">
                            <img
                                src={BeePack}
                                className="beePack"
                                alt="Pack of NFTS with a bee drawed in the center."
                            />
                            <div className="nextElectionDate">
                                <GLOBAL_STYLE.H4 className="electionDateHeadline">Next elections</GLOBAL_STYLE.H4>
                                <GLOBAL_STYLE.H1 className="electionMonth">January 2022</GLOBAL_STYLE.H1>
                            </div>
                            <img
                                src={BeePack}
                                className="beePack"
                                alt="Pack of NFTS with a bee drawed in the center."
                            />
                        </div>
                        <img src={Bees} className="bees" alt="Fours bees flying upward." />
                    </div>
                </div>
                <div
                    css={{
                        display: 'flex',
                        flexDirection: 'column-reverse',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: GLOBAL_STYLE.spacing.s,
                        marginLeft: GLOBAL_STYLE.spacing.s,
                        [GLOBAL_STYLE.mediaQuery.tabletUp]: {
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                        },
                        '& .oigLogo': {
                            width: '30vw',
                            maxWidth: 500,
                            objectFit: 'contain',
                            marginTop: GLOBAL_STYLE.spacing.s,
                        },
                        '& .electionProcess': {
                            [GLOBAL_STYLE.mediaQuery.tabletUp]: {
                                marginLeft: GLOBAL_STYLE.spacing.xl,
                            },
                        },
                        '& .electionProcessTitle': {
                            marginBottom: GLOBAL_STYLE.spacing.m,
                        },
                        '& .electionStep': {
                            borderBottom: `1px solid ${GLOBAL_STYLE.colors.blue04}`,
                            marginTop: GLOBAL_STYLE.spacing.s,
                        },
                        '& .electionStepName': {
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: GLOBAL_STYLE.spacing.xs,
                        },
                        '& .itemPolygon': {
                            marginRight: GLOBAL_STYLE.spacing.xs,
                        },
                        '& .electionStepNameText': {
                            marginBottom: 0,
                        },
                        '& .electionStepContent': {
                            marginBottom: GLOBAL_STYLE.spacing.s,
                        }
                    }}
                >
                    <img src={oigLogo} className="oigLogo" alt="WAX Office of Inspector General logo." />
                    <div className="electionProcess">
                        <GLOBAL_STYLE.H3 className="electionProcessTitle">The Election Process</GLOBAL_STYLE.H3>
                        <div className="electionStep">
                            <div className="electionStepName">
                                <img src={ItemPolygon} className="itemPolygon" alt="" />
                                <GLOBAL_STYLE.H4 className="electionStepNameText">The nomination phase</GLOBAL_STYLE.H4>
                            </div>
                            <GLOBAL_STYLE.P className="electionStepContent">
                                In this phase the nominees can accept or decline, and provide additional information.{' '}
                            </GLOBAL_STYLE.P>
                        </div>
                        <div className="electionStep">
                            <div className="electionStepName">
                                <img src={ItemPolygon} className="itemPolygon" alt="" />
                                <GLOBAL_STYLE.H4 className="electionStepNameText">The voting phase</GLOBAL_STYLE.H4>
                            </div>
                            <GLOBAL_STYLE.P className="electionStepContent">WAX token holders can vote on one OIG candidate.</GLOBAL_STYLE.P>
                        </div>
                        <div className="electionStep">
                            <div className="electionStepName">
                                <img src={ItemPolygon} className="itemPolygon" alt="" />
                                <GLOBAL_STYLE.H4 className="electionStepNameText">The elected IG</GLOBAL_STYLE.H4>
                            </div>
                            <GLOBAL_STYLE.P className="electionStepContent">
                                The winner will be determined as the candidate with the most votes on the ballot. This
                                person will replace the interim IG at the beginning of the following month.
                            </GLOBAL_STYLE.P>
                        </div>
                    </div>
                </div>
                <IGinfo/>
            </div>
        );
  }
}

export default Home;
