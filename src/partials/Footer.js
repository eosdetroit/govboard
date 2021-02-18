/** @jsx jsx */

import React from 'react';

import { jsx } from '@emotion/react';
import * as GLOBAL_STYLE from '../theme';

import notionLogo from '../assets/notion.svg';
import mediumLogo from '../assets/medium.svg';
import waxLogo from '../assets/wax-primary-logo.png';
import builtWithLove from '../assets/builtWithLove.svg';

class Footer extends React.Component {
    render() {
        return (
            <div
                css={{
                    padding: GLOBAL_STYLE.spacing.s,
                    backgroundColor: GLOBAL_STYLE.colors.white02,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    [GLOBAL_STYLE.mediaQuery.largeMobileUp]: {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    },
                    '& .footerImage': {
                        height: 40,
                        objectFit: 'contain',
                        marginBottom: GLOBAL_STYLE.spacing.s,
                        [GLOBAL_STYLE.mediaQuery.largeMobileOnly]: {
                            marginBottom: 0,
                        },
                    },
                    '& .social ': {
                        display: 'flex',
                        '& .footerImage': {
                            margin: `0 ${GLOBAL_STYLE.spacing.xxs}`,
                        },
                    },
                }}
            >
                <div className="social">
                    <a
                        href="https://www.notion.so/WAX-Office-of-Inspector-General-b519bd5514ac4da696e798c4df12b0a7"
                        title="OIG Knowledge Base"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footerLink"
                    >
                        <img className="footerImage" src={notionLogo} alt="OIG Knowledge Base" />
                    </a>
                    <a
                        href="https://medium.com/@waxoig"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footerLink"
                    >
                        <img className="footerImage" src={mediumLogo} alt="Medium" />
                    </a>
                </div>
                <a
                    href="https://wax.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footerLink"
                    css={{
                        margin: `${GLOBAL_STYLE.spacing.s} 0`,
                        [GLOBAL_STYLE.mediaQuery.tabletUp]: {
                            margin: 0,
                        },
                    }}
                >
                    <img className="footerImage" src={waxLogo} alt="WAX" />
                </a>
                <img className="footerImage" src={builtWithLove} alt="Built with love by EOS Detroit." />
            </div>
        );
    }
}

export default Footer;
