/** @jsx jsx */

import React from 'react';
import { Route } from 'react-router-dom';
import * as waxjs from '@waxio/waxjs/dist';
import { jsx } from '@emotion/react';

import CandidateGrid from '../partials/candidate-grid-template.js';
import CandidateSingle from '../partials/candidateSingle';
import { withUAL } from 'ual-reactjs-renderer';
import * as GLOBAL_STYLE from '../theme';

import { formatTime, formatDate } from '../utils/utils';

import ItemPolygon from '../assets/blueBee.svg';

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);



class Vote extends React.Component {
    constructor(props) {

        super(props);
        this.state = {
            candidates: [],
            activeCandidate: null,
            nextPage: 10,
            prevPage: 0,
            candidateLimit: 10,
            candidatesDisplayed: 100,
            candidatePage: 0,
            title: '',
            description: '',
            nmn_open: '',
            nmn_close: '',
            vote_open: '',
            vote_close: '',
            leaderCandidates: [],
            ballot: '',
        };
        this.GetCandidates = this.GetCandidates.bind(this);
        this.GetElectionInfo = this.GetElectionInfo.bind(this);
        this.renderPagination = this.renderPagination.bind(this);
        this.renderElectionStatus = this.renderElectionStatus.bind(this);
        this.CandidatePaginationNext = this.CandidatePaginationNext.bind(this);
        this.CandidatePaginationPrev = this.CandidatePaginationPrev.bind(this);
        this.renderWinner = this.renderWinner.bind(this);
    }

    async GetElectionInfo() {
        try {
            let resp = await wax.rpc.get_table_rows({
                limit: 1,
                code: 'oig',
                scope: 'oig',
                table: 'election',
                json: true,
            });
            let activeBallot = resp.rows[0];
            if (activeBallot === '') {
            } else {
                let leaderResp = await wax.rpc.get_table_rows({
                    code: 'decide',
                    scope: 'decide',
                    table: 'ballots',
                    limit: 1,
                    lower_bound: activeBallot.ballot,
                    upper_bound: activeBallot.ballot,
                    json: true,
                });
                let formattedNomOpen = new Date(activeBallot.nmn_open + 'Z').toString();
                let formattedNomClose = new Date(activeBallot.nmn_close + 'Z').toString();
                let formattedVoteOpen = new Date(activeBallot.vote_open + 'Z').toString();
                let formattedVoteClose = new Date(activeBallot.vote_close + 'Z').toString();
                let leaderCandidates = [];
                if (Array.isArray(leaderResp.rows) && leaderResp.rows.length !== 0) {
                    leaderCandidates = leaderResp.rows[0].options.sort(
                        (a, b) => parseFloat(b.value) - parseFloat(a.value)
                    );
                }
                let election = await wax.rpc.get_table_rows({
                    limit: 1,
                    code: 'oig',
                    scope: 'oig',
                    table: 'election',
                    json: true
                });

                let electionState = election.rows[0].state;

                console.log(this.state.electionState);
                if(electionState === 4){

                    let newCandidates = [];
                
                    this.state.candidates.forEach((candidate, index) => {
                        leaderCandidates.forEach((ballot) => {
                            if (ballot.key === candidate.owner) {
                                let newCandidate = { ...candidate, value: ballot.value };
                                newCandidates.push(newCandidate);
                            }
                        });
                    });
                    newCandidates.sort((a, b) => parseFloat(b.value) - parseFloat(a.value));
                    this.setState({
                        candidates: newCandidates,
                    });
                }

                this.setState({
                    ballot: activeBallot.ballot,
                    title: activeBallot.title,
                    description: activeBallot.description,
                    nmn_open: formattedNomOpen,
                    nmn_close: formattedNomClose,
                    vote_open: formattedVoteOpen,
                    vote_close: formattedVoteClose,
                    leaderCandidates: leaderCandidates,
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    async GetCandidates() {
        try {
            let resp = await wax.rpc.get_table_rows({
                code: 'oig',
                scope: 'oig',
                table: 'nominees',
                lower_bound: 1,
                limit: this.state.candidatesDisplayed,
                json: true,
            });
            let displayPagination = 1;
            if (resp.rows.length > 10) {
                displayPagination = 1;
            }
            console.log(resp.rows);
            let maxPage = resp.rows.length / 10;
            this.setState({
                candidates: resp.rows,
                candidatePage: 1,
                maxPage: maxPage,
                displayPagination: displayPagination,
            });
            return await this.GetElectionInfo();
        } catch (e) {
            console.log(e);
        }
    }

    async CandidatePaginationNext() {
        if (this.state.ceilingReached === 1) {
            // Do Nothing
        } else if (
            this.state.maxPage - this.state.candidatePage >= 1 &&
            this.state.nextPage !== this.state.candidates.length
        ) {
            let candidatePage = this.state.candidatePage + 1;
            let prevPage = this.state.prevPage + 10;
            let nextPage = this.state.nextPage + 10;
            this.setState({
                nextPage: nextPage,
                prevPage: prevPage,
                candidatePage: candidatePage,
            });
            console.log(this.state);
        } else if (
            this.state.maxPage - this.state.candidatePage < 1 &&
            this.state.nextPage !== this.state.candidates.length
        ) {
            let prevPage = this.state.prevPage + 10;
            let nextPage = this.state.candidates.length;
            this.setState({
                nextPage: nextPage,
                prevPage: prevPage,
                ceilingReached: 1,
            });
            console.log(this.state);
        }
    }

    CandidatePaginationPrev() {
        let candidatePage = this.state.candidatePage - 1;
        if (this.state.candidatePage === 0) {
            this.setState({
                nextPage: 10,
                prevPage: 0,
                candidatePage: 0,
                ceilingReached: 0,
            });
        } else if (this.state.maxPage - this.state.candidatePage < 1) {
            let prevPage = this.state.prevPage - 10;
            let nextPage = this.state.candidates.length - (this.state.maxPage - this.state.candidatePage) * 10;
            this.setState({
                nextPage: nextPage,
                prevPage: prevPage,
                candidatePage: candidatePage,
                ceilingReached: 0,
            });
            console.log(nextPage);
        } else {
            let prevPage = this.state.prevPage - 10;
            let nextPage = this.state.nextPage - 10;
            this.setState({
                nextPage: nextPage,
                prevPage: prevPage,
                candidatePage: candidatePage,
                ceilingReached: 0,
            });
        }
        console.log(this.state);
    }

    renderPagination() {
        if (this.state.displayPagination === 1) {
            return (
                <div className="pagination-wrapper">
                    <button onClick={this.CandidatePaginationPrev} className="btn">
                        Prev
                    </button>
                    <button onClick={this.CandidatePaginationNext} className="btn">
                        Next
                    </button>
                </div>
            );
        } else {
            // Do not render
        }
    }

    electionCurrentState() {
        switch (this.props.electionState) {
            case 1:
                return <GLOBAL_STYLE.H2 className="electionState">Not Started</GLOBAL_STYLE.H2>;
            case 2:
                return <GLOBAL_STYLE.H2 className="electionState">Nominations Open</GLOBAL_STYLE.H2>;
            case 3:
                return <GLOBAL_STYLE.H2 className="electionState">Nominations Closed</GLOBAL_STYLE.H2>;
            case 4:
                return <GLOBAL_STYLE.H2 className="electionState">Voting Open</GLOBAL_STYLE.H2>;
            case 5:
                return <GLOBAL_STYLE.H2 className="electionState">Voting Ended</GLOBAL_STYLE.H2>;
            default:
                return;
        }
    }

    renderElectionStatus() {
        return (
            <div
                css={{
                    textAlign: 'center',
                    '& .label': {
                        marginBottom: 0,
                    },
                    '& .electionState': {
                        marginTop: 0,
                    },
                }}
            >
                <GLOBAL_STYLE.H5 className="label">Election Status</GLOBAL_STYLE.H5>
                {this.electionCurrentState()}
            </div>
        );
    }

    renderWinner() {
        return (
            <div>
                {this.state.leaderCandidates.slice(0, 1).map((leaderCandidate, key, index, value) => (
                    <Winner data={leaderCandidate} index={index} ballot={this.state.ballot} key={leaderCandidate.key} />
                ))}
            </div>
        );
    }

    renderBallotID() {
        return (
            <div
                css={{
                    textAlign: 'center',
                    marginBottom: GLOBAL_STYLE.spacing.s,
                    '& .label': {
                        marginBottom: 0,
                    },
                    h4: {
                        marginTop: 0,
                        fontWeight: 600,
                    },
                }}
            >
                <GLOBAL_STYLE.H5 className="label">Ballot ID</GLOBAL_STYLE.H5>
                <GLOBAL_STYLE.H4>{this.state.ballot}</GLOBAL_STYLE.H4>
            </div>
        );
    }

    renderElectionDates() {
        return (
            <div
                css={{
                    [GLOBAL_STYLE.mediaQuery.tabletLandscapeUp]: {
                        width: 400,
                    },
                    '& .electionStep': {
                        borderBottom: `1px solid ${GLOBAL_STYLE.colors.blue04}`,
                        padding: `${GLOBAL_STYLE.spacing.xxs} 0`,
                        [GLOBAL_STYLE.mediaQuery.tabletLandscapeUp]: {
                            display: 'flex',
                            justifyContent: 'space-between',
                        },
                    },
                    '& .electionStep:first-of-type': {
                        borderTop: `1px solid ${GLOBAL_STYLE.colors.blue04}`,
                    },
                    '& .electionStepName': {
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: GLOBAL_STYLE.spacing.xs,
                    },
                    '& .itemPolygon': {
                        marginRight: GLOBAL_STYLE.spacing.xs,
                        height: 18,
                        objectFit: 'contain',
                    },
                    '& .electionStepNameText': {
                        marginBottom: 0,
                        marginTop: 0,
                    },
                    '& .label': {
                        marginBottom: 0,
                        fontWeight: 600,
                        textAlign: 'center',
                    },
                    '& .dateText, & .timeText': {
                        margin: 0,
                    },
                    '& .date': {
                        display: 'flex',
                        flexDirection: 'column',
                        textAlign: 'center',
                        marginBottom: GLOBAL_STYLE.spacing.xs,
                    },
                }}
            >
                <div className="electionStep">
                    <div className="electionStepName">
                        <img src={ItemPolygon} className="itemPolygon" alt="" />
                        <GLOBAL_STYLE.H5 className="electionStepNameText">Nomination Period</GLOBAL_STYLE.H5>
                    </div>
                    <div className="dates">
                        <div className="date">
                            <GLOBAL_STYLE.PTINY className="label">Begins</GLOBAL_STYLE.PTINY>
                            <GLOBAL_STYLE.P className="dateText">{formatDate(this.state.nmn_open)}</GLOBAL_STYLE.P>
                            <GLOBAL_STYLE.PTINY className="timeText">
                                {formatTime(this.state.nmn_open)}
                            </GLOBAL_STYLE.PTINY>
                        </div>
                        <div className="date">
                            <GLOBAL_STYLE.PTINY className="label">Ends</GLOBAL_STYLE.PTINY>
                            <GLOBAL_STYLE.P className="dateText">{formatDate(this.state.nmn_close)}</GLOBAL_STYLE.P>
                            <GLOBAL_STYLE.PTINY className="timeText">
                                {formatTime(this.state.nmn_close)}
                            </GLOBAL_STYLE.PTINY>
                        </div>
                    </div>
                </div>
                <div className="electionStep">
                    <div className="electionStepName">
                        <img src={ItemPolygon} className="itemPolygon" alt="" />
                        <GLOBAL_STYLE.H5 className="electionStepNameText">Voting Period</GLOBAL_STYLE.H5>
                    </div>
                    <div className="dates">
                        <div className="date">
                            <GLOBAL_STYLE.PTINY className="label">Begins</GLOBAL_STYLE.PTINY>
                            <GLOBAL_STYLE.P className="dateText">{formatDate(this.state.vote_open)}</GLOBAL_STYLE.P>
                            <GLOBAL_STYLE.PTINY className="timeText">
                                {formatTime(this.state.vote_open)}
                            </GLOBAL_STYLE.PTINY>
                        </div>
                        <div className="date">
                            <GLOBAL_STYLE.PTINY className="label">Ends</GLOBAL_STYLE.PTINY>
                            <GLOBAL_STYLE.P className="dateText">{formatDate(this.state.vote_close)}</GLOBAL_STYLE.P>
                            <GLOBAL_STYLE.PTINY className="timeText">
                                {formatTime(this.state.vote_close)}
                            </GLOBAL_STYLE.PTINY>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        return this.GetCandidates();
    }

    render() {
        console.log(this.props);
        if (this.props.electionState === 0) {
            return (
                <GLOBAL_STYLE.PageContent>
                    <GLOBAL_STYLE.H2>There is currently no election running.</GLOBAL_STYLE.H2>
                    <GLOBAL_STYLE.H5>
                        Please check the <GLOBAL_STYLE.InlineLink to="/">home page</GLOBAL_STYLE.InlineLink> for
                        upcoming elections.
                    </GLOBAL_STYLE.H5>
                </GLOBAL_STYLE.PageContent>
            );
        } else if (this.props.electionState === 1) {
            return (
                <GLOBAL_STYLE.PageContent
                    css={{
                        [GLOBAL_STYLE.mediaQuery.tabletLandscapeUp]: {
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                        },
                    }}
                >
                    <div>
                        {this.renderElectionStatus()}
                        <GLOBAL_STYLE.P>{this.state.description}</GLOBAL_STYLE.P>
                        {this.renderBallotID()}
                    </div>
                    <div>
                        {this.renderElectionDates()}
                        <GLOBAL_STYLE.H5>
                            Please check back during the scheduled time to nominate a candidate.
                        </GLOBAL_STYLE.H5>
                    </div>
                </GLOBAL_STYLE.PageContent>
            );
        } else if (this.props.electionState === 5) {
            return (
                <GLOBAL_STYLE.PageContent>
                    {this.renderElectionStatus()}
                    {this.renderBallotID()}
                    {this.renderWinner()}
                </GLOBAL_STYLE.PageContent>
            );
        } else {
            console.log(this.state.candidates);
            return (
                <GLOBAL_STYLE.PageContent>
                    <Route exact path="/candidates">
                        <div
                            css={{
                                [GLOBAL_STYLE.mediaQuery.desktopUp]: {
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-evenly',
                                },
                                '& h2': {
                                    textAlign: 'center',
                                },
                                '& .column': {
                                    [GLOBAL_STYLE.mediaQuery.desktopUp]: {
                                        marginRight: GLOBAL_STYLE.spacing.l,
                                    }
                                }
                            }}
                        >
                            <div className="column">
                                {this.renderElectionStatus()}
                                <GLOBAL_STYLE.P>{this.state.description}</GLOBAL_STYLE.P>
                                {this.renderBallotID()}
                                {this.renderElectionDates()}
                            </div>
                            <div>
                                <div id="castvote">
                                </div>
                                {this.state.electionState < 3 ? "" : <GLOBAL_STYLE.H2>Candidates</GLOBAL_STYLE.H2>}
                                {this.state.candidates !== [] ? (
                                    <React.Fragment>
                                        {this.state.candidates
                                            .slice(this.state.prevPage, this.state.nextPage)
                                            .map((candidate, key) => (
                                                <CandidateGrid data={candidate} ballot={this.props.ballot} activeUser={this.props.activeUser} />
                                            ))}
                                    </React.Fragment>
                                ) : (
                                    <GLOBAL_STYLE.H5>
                                        There are currently no candidates participating in this election.
                                    </GLOBAL_STYLE.H5>
                                )}
                            </div>
                        </div>
                    </Route>
                    <Route path="/candidates/:owner">
                        <CandidateSingle
                            activeUser={this.props.activeUser}
                            ballot={this.props.ballot}
                            electionState={this.props.electionState}
                        />
                    </Route>
                </GLOBAL_STYLE.PageContent>
            );
        }
    }
}

export default withUAL(Vote);

class Winner extends Vote {
    constructor(props) {
        super(props);
        this.GetCandidateInfo = this.GetCandidateInfo.bind(this);
    }
    async GetCandidateInfo() {
        let resp = await wax.rpc.get_table_rows({
            code: 'oig',
            scope: 'oig',
            table: 'nominees',
            limit: 1,
            lower_bound: this.props.data.key,
            upper_bound: this.props.data.key,
            json: true,
        });
        console.log(resp);
        if (Array.isArray(resp.rows) && resp.rows.length !== 0) {
            this.setState({
                name: resp.rows[0].name,
                picture: resp.rows[0].picture,
            });
        }
    }

    componentDidMount() {
        return this.GetCandidateInfo();
    }

    render() {
        return (
            <div className="winner" key={this.props.data.key}
                css={{
                    textAlign: 'center',
                    '& h3': {
                        marginTop: GLOBAL_STYLE.spacing.xs,
                    }
                }}
            >
                <GLOBAL_STYLE.H2>Election Winner</GLOBAL_STYLE.H2>
                <img
                    css={{
                        width: 250,
                        objectFit: 'contain',
                    }}
                    src={this.state.picture} alt={this.state.name}
                />
                <GLOBAL_STYLE.H3>{this.state.name}</GLOBAL_STYLE.H3>
                <GLOBAL_STYLE.H5>{this.props.data.key}</GLOBAL_STYLE.H5>
                <GLOBAL_STYLE.H5>{this.props.data.value}S</GLOBAL_STYLE.H5>
            </div>
        );
    }
}
