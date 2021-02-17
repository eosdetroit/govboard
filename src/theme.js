/** @jsx jsx */

import { jsx } from '@emotion/react';

export const colors = {
    'blue01': '#193648',
    'blue02': '#3B5B66',
    'blue03': '#8EB0BA',
    'blue04': '#CBDADF',
    'orange01': '#DB7B0B',
    'orange02': '#E18A00',
    'orange03': '#E4A71B',
    'orange04': '#EDC542',
    'grey01': '#373E42',
    'grey02': '#5C6469',
    'white01': '#FFFFFF',
    'white02': '#F8F7F4',
};

export const textMaxWidth = '575px';

export const spacing = {
    'xxs': '8px',
    'xs': '16px',
    's': '24px',
    'm': '32px',
    'l': '40px',
    'xl': '62px',
    'xxl': '80px',
};

export const border = {
    'radius-01': '3px'
}

const breakpoints = [576, 768, 992, 1200];

export const mediaQuery = {
    'mobileOnly': `@media (max-width: ${breakpoints[0] - 1}px)`,
    'largeMobileOnly': `@media (max-width: ${breakpoints[1] - 1}px)`,
    'largeMobileUp': `@media (min-width: ${breakpoints[0]}px)`,
    'tabletUp': `@media (min-width: ${breakpoints[1]}px)`,
    'tabletLandscapeUp': `@media (min-width: ${breakpoints[2]}px)`,
    'desktopUp': `@media (min-width: ${breakpoints[3]}px)`,
};

export const Button = (props) => (
    <button
        css={{
            color: props.primary ? '#413418' : props.text ? colors.blue02 : colors.blue01,
            backgroundColor: props.primary ? colors.orange02 : props.text ? 'transparent' : colors.blue04,
            padding: `${spacing.xxs} ${spacing.xs}`,
            border: 'none',
            fontFamily: `'Mulish', sans-serif`,
            fontSize: props.tiny ? '16px' : '18px',
            fontWeight: 400,
            borderRadius: 8,
            transition: `background-color 0.3s ease-in-out`,
            '&:hover': {
                backgroundColor: props.primary ? colors.orange02 : props.text? colors.blue04 : colors.blue03,
                cursor: 'pointer',
            }
        }}
        {...props}
    />
);

 export const H1 = (props) => (
     <h1
         css={{
             fontFamily: `'Mulish', sans-serif`,
             fontSize: 48,
             lineHeight: '130%',
             fontWeight: 700,
             color: colors.blue01,
             maxWidth: textMaxWidth,
             [mediaQuery.mobileOnly]: {
                 fontSize: 32,
             }
         }}
         {...props}
     />
 );

export const H2 = (props) => (
    <h2
        css={{
            fontFamily: `'Mulish', sans-serif`,
            fontSize: 32,
            lineHeight: '130%',
            fontWeight: 700,
            color: colors.blue01,
            maxWidth: textMaxWidth,
        }}
        {...props}
    />
);

export const H3 = (props) => (
    <h3
        css={{
            fontFamily: `'Mulish', sans-serif`,
            fontSize: 28,
            lineHeight: '130%',
            fontWeight: 700,
            color: colors.blue01,
            maxWidth: textMaxWidth,
        }}
        {...props}
    />
);

export const H4 = (props) => (
    <h4
        css={{
            fontFamily: `'Mulish', sans-serif`,
            fontSize: 24,
            lineHeight: '130%',
            fontWeight: 400,
            color: colors.blue01,
            maxWidth: textMaxWidth,
        }}
        {...props}
    />
);

export const H5 = (props) => (
    <h5
        css={{
            fontFamily: `'Mulish', sans-serif`,
            fontSize: 20,
            lineHeight: '150%',
            fontWeight: 400,
            color: colors.blue01,
            maxWidth: textMaxWidth,
        }}
        {...props}
    />
);

export const H6 = (props) => (
    <h6
        css={{
            fontFamily: `'Mulish', sans-serif`,
            fontSize: 18,
            lineHeight: '150%',
            fontWeight: 600,
            color: colors.blue01,
            maxWidth: textMaxWidth,
        }}
        {...props}
    />
);

export const P = (props) => (
    <p
        css={{
            fontFamily: `'Open Sans', sans-serif`,
            fontSize: 18,
            lineHeight: '160%',
            fontWeight: 400,
            color: colors.blue02,
            maxWidth: textMaxWidth,
        }}
        {...props}
    />
);

export const PBOLD = (props) => (
    <p
        css={{
            fontFamily: `'Open Sans', sans-serif`,
            fontSize: 18,
            lineHeight: '160%',
            fontWeight: 700,
            color: colors.blue02,
            maxWidth: textMaxWidth,
        }}
        {...props}
    />
);

export const PTINY = (props) => (
    <p
        css={{
            fontFamily: `'Open Sans', sans-serif`,
            fontSize: 14,
            lineHeight: '160%',
            fontWeight: 400,
            color: colors.blue02,
            maxWidth: textMaxWidth,
        }}
        {...props}
    />
);