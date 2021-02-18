/** @jsx jsx */

import { jsx } from '@emotion/react';
import * as GLOBAL_STYLE from '../theme';

const IMAGE_WIDTH = 250;

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

export default function RenderIGCard(props) {
    return (
        <div
            css={{
                backgroundColor: `${GLOBAL_STYLE.colors.blue05}`,
                padding: GLOBAL_STYLE.spacing.s,
                marginTop: GLOBAL_STYLE.spacing.m,
                borderRadius: GLOBAL_STYLE.border.radius03,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                [GLOBAL_STYLE.mediaQuery.tabletUp]: {
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    width: 700,
                },
                [GLOBAL_STYLE.mediaQuery.tabletLandscapeUp]: {
                    width: 800,
                },
                '& .label': {
                    fontWeight: 700,
                    marginTop: GLOBAL_STYLE.spacing.xs,
                    marginBottom: 0,
                },
                '& .igData': {
                    display: 'flex',
                    flexDirection: 'column',
                    [GLOBAL_STYLE.mediaQuery.mobileOnly]: {
                        width: 270,
                    },
                    [GLOBAL_STYLE.mediaQuery.largeMobileOnly]: {
                        width: 350,
                    },
                    [GLOBAL_STYLE.mediaQuery.tabletUp]: {
                        marginLeft: GLOBAL_STYLE.spacing.xl,
                        maxWidth: 330,
                    },
                    [GLOBAL_STYLE.mediaQuery.tabletLandscapeUp]: {
                        maxWidth: 440,
                    }
                },
            }}
        >
            <div
                css={{
                    width: IMAGE_WIDTH,
                    height: IMAGE_WIDTH,
                    position: 'relative',
                    display: 'inlineBlock',
                    backgroundImage: `url(${props.igInfo.picture})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: GLOBAL_STYLE.colors.white01,
                    alignSelf: 'center',
                }}
            >
                <span
                    css={{
                        top: `0`,
                        borderTop: `0px solid transparent`,
                        borderBottom: `${IMAGE_WIDTH/4}px solid transparent`,
                        position: `absolute`,
                        display: `block`,
                        float: `left`,
                        borderLeft: `${IMAGE_WIDTH/2}px solid ${GLOBAL_STYLE.colors.blue05}`,
                        borderRight: `${IMAGE_WIDTH/2}px solid ${GLOBAL_STYLE.colors.blue05}`,
                    }}
                ></span>
                <span
                    css={{
                        bottom: 0,
                        borderBottom: `0px solid transparent`,
                        borderTop: `${IMAGE_WIDTH/4}px solid transparent`,
                        position: `absolute`,
                        display: `block`,
                        float: `left`,
                        borderLeft: `${IMAGE_WIDTH/2}px solid ${GLOBAL_STYLE.colors.blue05}`,
                        borderRight: `${IMAGE_WIDTH/2}px solid ${GLOBAL_STYLE.colors.blue05}`,
                    }}
                ></span>
            </div>
            <div>
                <div className="igData">
                    <GLOBAL_STYLE.PTINY className="label">Name</GLOBAL_STYLE.PTINY>
                    {props.igInfo.name}
                </div>
                <div className="igData">
                    <GLOBAL_STYLE.PTINY className="label">Account</GLOBAL_STYLE.PTINY>
                    {props.igInfo.account}
                </div>
                <div className="igData">
                    <GLOBAL_STYLE.PTINY className="label">Description</GLOBAL_STYLE.PTINY>
                    {props.igInfo.descriptor}
                </div>
                <div className="igData">
                    <GLOBAL_STYLE.PTINY className="label">Term began</GLOBAL_STYLE.PTINY>
                    {formatDate(props.igInfo.term[0])}
                </div>
                <div className="igData">
                    <GLOBAL_STYLE.PTINY className="label">Term ends</GLOBAL_STYLE.PTINY>
                    {formatDate(props.igInfo.term[1])}
                </div>
            </div>
        </div>
    );
}
