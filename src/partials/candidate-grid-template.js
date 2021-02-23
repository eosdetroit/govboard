/** @jsx jsx */

import React from 'react';
import {
  Link,
} from "react-router-dom";
import { jsx } from '@emotion/react';
import { submitVote } from '../middleware.js';

import * as GLOBAL_STYLE from '../theme';

class CandidateGrid extends React.Component {
    async VoteCandidate() {
        await submitVote(this.props.activeUser, this.props.ballot, this.props.candidate.owner);
    }

    render() {
        return (
            <Link
                key={this.props.data.owner}
                to={'/candidates/' + this.props.data.owner}
                css={{
                    display: 'grid',
                    gridTemplateColumns: '35% auto',
                    gridTemplateRows: '1fr 20%',
                    columnGap: GLOBAL_STYLE.spacing.s,
                    rowGap: GLOBAL_STYLE.spacing.xs,
                    marginBottom: GLOBAL_STYLE.spacing.s,
                    padding: GLOBAL_STYLE.spacing.xs,
                    borderRadius: GLOBAL_STYLE.border.radius03,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        textDecoration: 'none',
                        backgroundColor: GLOBAL_STYLE.colors.blue05,
                    },
                    [GLOBAL_STYLE.mediaQuery.tabletLandscapeUp]: {
                        width: 600,
                        justifyContent: 'center',
                    },
                    '& .image': {
                        width: '100%',
                        objectFit: 'cover',
                        gridColumnStart: 1,
                        gridRowStart: 1,
                        gridColumnEnd: 1,
                        gridRowEnd: 1,
                    },
                    '& .content': {
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gridColumnStart: 2,
                        gridRowStart: 1,
                        gridColumnEnd: 2,
                        gridRowEnd: 2,
                    },
                    '& .owner, & .voteCount': {
                        marginTop: 0,
                    },
                    '& .voteCount': {
                      alignSelf: 'flex-end',
                    },
                    '& .voteButton': {
                        gridColumnStart: 1,
                        gridRowStart: 2,
                        gridColumnEnd: 1,
                        gridRowEnd: 2,
                    },
                }}
            >
                <img className="image" src={this.props.data.picture} alt="" />
                <div className="content">
                    <GLOBAL_STYLE.H4 className="account">{this.props.data.name}</GLOBAL_STYLE.H4>
                    <GLOBAL_STYLE.P className="owner">{this.props.data.owner}</GLOBAL_STYLE.P>
                    <GLOBAL_STYLE.H6 className="voteCount">{this.props.data.value}S</GLOBAL_STYLE.H6>
                </div>
                <GLOBAL_STYLE.Button className="voteButton" onClick={this.VoteCandidate}>
                    Vote for {this.props.data.name}
                </GLOBAL_STYLE.Button>
            </Link>
        );
    }
}

export default CandidateGrid;
