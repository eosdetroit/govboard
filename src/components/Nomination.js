/** @jsx jsx */

import React from 'react';

import SimpleReactValidator from 'simple-react-validator';
import * as waxjs from '@waxio/waxjs/dist';
import { withUAL } from 'ual-reactjs-renderer';

import { jsx } from '@emotion/react';
import * as GLOBAL_STYLE from '../theme';

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

class Nomination extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeUser: this.props.activeUser,
            isNominated: '',
            hasAccepted: false,
            nominee: '',
            name: '',
            picture: '',
            description: '',
            twitter: '',
            wechat: '',
            telegram: '',
            redirect: 0,
        };
        this.validator = new SimpleReactValidator();
        this.nominateCandidate = this.nominateCandidate.bind(this);
        this.acceptNomination = this.acceptNomination.bind(this);
        this.declineNomination = this.declineNomination.bind(this);
        this.updateNominee = this.updateNominee.bind(this);
    }

    async checkNominations() {
        try {
            let resp = await wax.rpc.get_table_rows({
                code: 'oig',
                scope: 'oig',
                table: 'nominations',
                limit: 1,
                lower_bound: this.props.accountName,
                upper_bound: this.props.accountName,
                json: true,
            });
            if (Array.isArray(resp.rows) && resp.rows.length === 0) {
            } else {
                this.setState({
                    isNominated: true,
                    hasAccepted: resp.rows[0].accepted,
                });

                if (resp.rows[0].accepted === 1) {
                    let nomineeInfo = await wax.rpc.get_table_rows({
                        code: 'oig',
                        scope: 'oig',
                        table: 'nominees',
                        limit: 1,
                        lower_bound: this.props.accountName,
                        upper_bound: this.props.accountName,
                        json: true,
                    });
                    console.log(nomineeInfo);
                    if (Array.isArray(nomineeInfo.rows) && nomineeInfo.rows.length !== 0) {
                        const name = 'name' in nomineeInfo.rows[0] ? nomineeInfo.rows[0].name : '';
                        const picture = 'picture' in nomineeInfo.rows[0] ? nomineeInfo.rows[0].picture : '';
                        const description = 'descriptor' in nomineeInfo.rows[0] ? nomineeInfo.rows[0].descriptor : '';
                        const telegram = 'telegram' in nomineeInfo.rows[0] ? nomineeInfo.rows[0].telegram : '';
                        const twitter = 'twitter' in nomineeInfo.rows[0] ? nomineeInfo.rows[0].twitter : '';
                        const wechat = 'wechat' in nomineeInfo.rows[0] ? nomineeInfo.rows[0].wechat : '';
                        this.setState({
                            name: name,
                            picture: picture,
                            description: description,
                            telegram: telegram,
                            twitter: twitter,
                            wechat: wechat,
                        });
                    }
                }
                console.log(this.state);
            }
        } catch (e) {
            console.log(e);
        }
    }

    async nominateCandidate() {
        const transaction = {
            actions: [
                {
                    account: 'oig',
                    name: 'nominate',
                    authorization: [
                        {
                            actor: this.state.activeUser.accountName,
                            permission: 'active',
                        },
                    ],
                    data: {
                        nominator: this.state.activeUser.accountName,
                        nominee: this.state.nominee,
                    },
                },
            ],
        };
        try {
            await this.state.activeUser.signTransaction(transaction, { blocksBehind: 3, expireSeconds: 30 });
            if (this.state.nominee === this.props.activeUser.accountName) {
                this.setState({
                    isNominated: true,
                    hasAccepted: 1,
                });
            }
            document.getElementById('nomform').innerHTML = 'You successfully nominated a candidate!';
            let nomform = document.getElementById('nomform');
            nomform.classList.add('success');
            nomform.classList.remove('error');
            nomform.innerHTML = 'You successfully nominated a candidate!';
        } catch (e) {
            let nomform = document.getElementById('nomform');
            nomform.classList.add('error');
            nomform.classList.remove('success');
            nomform.innerHTML = e;
        }
    }

    async acceptNomination() {
        try {
            const transaction = {
                actions: [
                    {
                        account: 'oig',
                        name: 'proclaim',
                        authorization: [
                            {
                                actor: this.props.accountName,
                                permission: 'active',
                            },
                        ],
                        data: {
                            nominee: this.props.accountName,
                            decision: true,
                        },
                    },
                ],
            };
            await this.state.activeUser.signTransaction(transaction, { blocksBehind: 3, expireSeconds: 30 });
            this.setState({
                isNominated: true,
                hasAccepted: 1,
            });
            let nomlist = document.getElementById('nomlist');
            nomlist.classList.add('success');
            nomlist.classList.remove('error');
            nomlist.innerHTML = 'You have accepted the nomination!';
        } catch (e) {
            let nomlist = document.getElementById('nomlist');
            nomlist.classList.add('error');
            nomlist.classList.remove('success');
            nomlist.innerHTML = e;
        }
    }

    async declineNomination() {
        try {
            const transaction = {
                actions: [
                    {
                        account: 'oig',
                        name: 'proclaim',
                        authorization: [
                            {
                                actor: this.props.accountName,
                                permission: 'active',
                            },
                        ],
                        data: {
                            nominee: this.props.accountName,
                            decision: false,
                        },
                    },
                ],
            };
            await this.state.activeUser.signTransaction(transaction, { blocksBehind: 3, expireSeconds: 30 });
            this.setState({
                isNominated: false,
                hasAccepted: 0,
            });
            let nomlist = document.getElementById('nomlist');
            nomlist.classList.add('success');
            nomlist.classList.remove('error');
            nomlist.innerHTML = 'You have declined the nomination!';
            document.getElementById('nomform').innerHTML = '';
        } catch (e) {
            let nomlist = document.getElementById('nomlist');
            nomlist.classList.add('error');
            nomlist.classList.remove('success');
            nomlist.innerHTML = e;
        }
    }

    async updateNominee() {
        if (this.validator.allValid()) {
            try {
                const transaction = {
                    actions: [
                        {
                            account: 'oig',
                            name: 'nominf',
                            authorization: [
                                {
                                    actor: this.props.accountName,
                                    permission: 'active',
                                },
                            ],
                            data: {
                                nominee: this.props.accountName,
                                name: this.state.name,
                                picture: this.state.picture,
                                descriptor: this.state.description,
                                telegram: this.state.telegram,
                                twitter: this.state.twitter,
                                wechat: this.state.wechat,
                                remove: false,
                            },
                        },
                    ],
                };
                await this.state.activeUser.signTransaction(transaction, { blocksBehind: 3, expireSeconds: 30 });
                let updatenom = document.getElementById('updatenom');
                updatenom.classList.add('success');
                updatenom.classList.remove('error');
                updatenom.innerHTML = 'You have updated your nomination info!';
            } catch (e) {
                let updatenom = document.getElementById('updatenom');
                updatenom.classList.add('error');
                updatenom.classList.remove('success');
                updatenom.innerHTML = e.message;
            }
        } else {
            this.validator.showMessages();
            // rerender to show messages for the first time
            // you can use the autoForceUpdate option to do this automatically`
            this.forceUpdate();
        }
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState(
            (prevState) => ({
                [name]: value,
            }),
            () => {}
        );
    };

    componentDidMount() {
        if (this.props.electionState === 2) {
            return this.checkNominations();
        }
    }

    isNominated() {
        if (this.state.isNominated === true && this.state.hasAccepted === 0) {
            return (
                <div
                    css={{
                        '& .accept': {
                            marginRight: GLOBAL_STYLE.spacing.xs,
                        },
                    }}
                >
                    <GLOBAL_STYLE.H3>{this.props.accountName}'s Nomination Status</GLOBAL_STYLE.H3>
                    <GLOBAL_STYLE.P>
                        Someone has nominated you for a WAX Office of the Inspector General position!
                    </GLOBAL_STYLE.P>
                    <div className="actionButtons">
                        <GLOBAL_STYLE.Button primary onClick={this.acceptNomination} className="btn accept">
                            Accept
                        </GLOBAL_STYLE.Button>
                        <GLOBAL_STYLE.Button text onClick={this.declineNomination} className="btn decline">
                            Decline
                        </GLOBAL_STYLE.Button>
                    </div>
                </div>
            );
        } else if (this.state.isNominated === true && this.state.hasAccepted === 1) {
            return (
                <div className="nomination-list">
                    <GLOBAL_STYLE.H3>{this.props.accountName}'s Nomination Status</GLOBAL_STYLE.H3>
                    <GLOBAL_STYLE.P>
                        You've accepted your nomination. If you would like to change your mind, click decline below.
                    </GLOBAL_STYLE.P>
                    <GLOBAL_STYLE.Button onClick={this.declineNomination} className="btn decline">
                        Decline
                    </GLOBAL_STYLE.Button>
                </div>
            );
        } else {
            return (
                <div className="nomination-list">
                    <GLOBAL_STYLE.H3>{this.props.accountName}'s Nominations</GLOBAL_STYLE.H3>
                    <GLOBAL_STYLE.P>
                        You are not currently nominated for a WAX office of the Inspector General position. You can
                        nominate yourself or someone else below.
                    </GLOBAL_STYLE.P>
                </div>
            );
        }
    }

    nominationForm() {
        return (
            <div className="nomination-form">
                <GLOBAL_STYLE.H3>Nominate a Candidate</GLOBAL_STYLE.H3>
                <GLOBAL_STYLE.P>Enter the WAX account name of the person you would like to nominate.</GLOBAL_STYLE.P>
                <div
                    css={{
                        display: 'flex',
                        alignItems: 'center',
                        [GLOBAL_STYLE.mediaQuery.mobileOnly]: {
                            flexDirection: 'column',
                        },
                        '& .nomineeInput': {
                            width: 270,
                            marginRight: GLOBAL_STYLE.spacing.xs,
                            [GLOBAL_STYLE.mediaQuery.mobileOnly]: {
                                marginRight: 0,
                                marginBottom: GLOBAL_STYLE.spacing.xs,
                            },
                        },
                    }}
                >
                    <GLOBAL_STYLE.Input
                        id="nomination-input"
                        type="text"
                        name="nominee"
                        className="nomineeInput"
                        placeholder="Nominee's WAX account name"
                        onChange={this.handleInputChange}
                    />
                    <GLOBAL_STYLE.Button onClick={this.nominateCandidate} className="btn inline-btn">
                        Nominate
                    </GLOBAL_STYLE.Button>
                </div>
            </div>
        );
    }

    hasAccepted() {
        if (this.state.hasAccepted === 1) {
            return (
                <div className="nomination-info-form">
                    <GLOBAL_STYLE.H2>Submit or Update Candidacy Information</GLOBAL_STYLE.H2>
                    <GLOBAL_STYLE.P>
                        Note: You will not appear on the candidate list until you submit your initial candidate details.
                        You can return to this page to update your details at any time during the nomination period.
                    </GLOBAL_STYLE.P>
                    <GLOBAL_STYLE.Fieldset>
                        <GLOBAL_STYLE.Label htmlFor="name">
                            Full Name<span className="required">*</span>
                        </GLOBAL_STYLE.Label>
                        <GLOBAL_STYLE.Input
                            type="text"
                            id="form-name"
                            name="name"
                            value={this.state.name}
                            maxLength="99"
                            required
                            onBlur={() => this.validator.showMessageFor('name')}
                            placeholder="John Doe"
                            onChange={this.handleInputChange}
                        />
                        {this.validator.message('name', this.state.name, 'required|alpha_space|max:99')}
                    </GLOBAL_STYLE.Fieldset>
                    <GLOBAL_STYLE.Fieldset>
                        <GLOBAL_STYLE.Label htmlFor="picture">
                            Picture<span className="required">*</span>
                        </GLOBAL_STYLE.Label>
                        <GLOBAL_STYLE.Input
                            type="text"
                            id="form-picture"
                            value={this.state.picture}
                            placeholder="Url to image file on the web"
                            maxLength="256"
                            required
                            onBlur={() => this.validator.showMessageFor('picture')}
                            name="picture"
                            onChange={this.handleInputChange}
                        />
                        <GLOBAL_STYLE.InputMessage>
                            Please use a square image (i.e. 250x250) for best results
                        </GLOBAL_STYLE.InputMessage>
                        {this.validator.message('picture', this.state.picture, [
                            'required',
                            {
                                regex: /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/,
                                max: 256,
                            },
                        ])}
                    </GLOBAL_STYLE.Fieldset>
                    <GLOBAL_STYLE.Fieldset>
                        <GLOBAL_STYLE.Label htmlFor="description">
                            Candidacy Platform<span className="required">*</span>
                        </GLOBAL_STYLE.Label>
                        <GLOBAL_STYLE.Textarea
                            id="form-description"
                            name="description"
                            value={this.state.description}
                            required
                            maxLength="2000"
                            onBlur={() => this.validator.showMessageFor('username')}
                            onChange={this.handleInputChange}
                        ></GLOBAL_STYLE.Textarea>
                        {this.validator.message('description', this.state.description, 'required|max:2000')}
                    </GLOBAL_STYLE.Fieldset>
                    <GLOBAL_STYLE.Fieldset>
                        <GLOBAL_STYLE.Label htmlFor="telegram">Telegram Handle</GLOBAL_STYLE.Label>
                        <GLOBAL_STYLE.Input
                            type="text"
                            id="form-telegram"
                            name="telegram"
                            value={this.state.telegram}
                            maxLength="99"
                            placeholder="Telegram username"
                            onChange={this.handleInputChange}
                        />
                        {this.validator.message('telegram', this.state.telegram, 'max:99')}
                    </GLOBAL_STYLE.Fieldset>
                    <GLOBAL_STYLE.Fieldset>
                        <GLOBAL_STYLE.Label htmlFor="twitter">Twitter Profile</GLOBAL_STYLE.Label>
                        <GLOBAL_STYLE.Input
                            type="text"
                            id="form-twitter"
                            name="twitter"
                            value={this.state.twitter}
                            maxLength="256"
                            placeholder="Twitter handle"
                            onChange={this.handleInputChange}
                        />
                        {this.validator.message('twitter', this.state.twitter, 'max:256')}
                    </GLOBAL_STYLE.Fieldset>
                    <GLOBAL_STYLE.Fieldset>
                        <GLOBAL_STYLE.Label htmlFor="wechat">WeChat Profile</GLOBAL_STYLE.Label>
                        <GLOBAL_STYLE.Input
                            type="text"
                            id="form-wechat"
                            name="wechat"
                            value={this.state.wechat}
                            maxLength="256"
                            placeholder="WeChat userid"
                            onChange={this.handleInputChange}
                        />
                        {this.validator.message('wechat', this.state.wechat, 'max:256')}
                    </GLOBAL_STYLE.Fieldset>
                    <div
                        css={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            '& .error': {
                                color: GLOBAL_STYLE.colors.red,
                            },
                        }}
                    >
                        <GLOBAL_STYLE.Button onClick={this.updateNominee} id="accept-nom" className="submit btn">
                            Submit
                        </GLOBAL_STYLE.Button>
                        <GLOBAL_STYLE.P className="error" id="updatenom"></GLOBAL_STYLE.P>
                    </div>
                </div>
            );
        }
    }

    render() {
        if (
            (this.props.electionState === 0 && this.props.activeUser !== null) ||
            (this.props.electionState === 1 && this.props.activeUser !== null) ||
            (this.props.electionState === 5 && this.props.activeUser !== null)
        ) {
            return (
                <GLOBAL_STYLE.PageContent>
                    <GLOBAL_STYLE.H2>Nominate</GLOBAL_STYLE.H2>
                    <GLOBAL_STYLE.P>
                        There is currently no election running. Please check the{' '}
                        <GLOBAL_STYLE.InlineLink to="/">home page</GLOBAL_STYLE.InlineLink> for upcoming elections.
                    </GLOBAL_STYLE.P>
                </GLOBAL_STYLE.PageContent>
            );
        } else if (
            (this.props.electionState === 3 && this.props.activeUser !== null) ||
            (this.props.electionState === 4 && this.props.activeUser !== null)
        ) {
            return (
                <GLOBAL_STYLE.PageContent>
                    <GLOBAL_STYLE.H1>Nominate</GLOBAL_STYLE.H1>
                    <GLOBAL_STYLE.P>
                        The nomination period for the current election has closed.{' '}
                        <GLOBAL_STYLE.InlineLink to="/candidates">Vote</GLOBAL_STYLE.InlineLink> for your favorite
                        candidate now!
                    </GLOBAL_STYLE.P>
                </GLOBAL_STYLE.PageContent>
            );
        } else if (this.props.electionState === 2 && this.props.activeUser !== null) {
            return (
                <GLOBAL_STYLE.PageContent>
                    <GLOBAL_STYLE.H1>Nominate</GLOBAL_STYLE.H1>
                    <div className="nomination-left-pane">
                        {this.isNominated()}
                        {this.nominationForm()}
                    </div>
                    <div className="nomination-right-pane">{this.hasAccepted()}</div>
                </GLOBAL_STYLE.PageContent>
            );
        } else {
            return (
                <GLOBAL_STYLE.PageContent>
                    <GLOBAL_STYLE.H1>Nominate</GLOBAL_STYLE.H1>
                    <GLOBAL_STYLE.P>Please login to view the nomination page.</GLOBAL_STYLE.P>
                </GLOBAL_STYLE.PageContent>
            );
        }
    }
}

export default withUAL(Nomination);
