import 'core-js/shim'; // Polyfill for IE

import React from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { LegablyHeader, LegablyFooter, Loader, FlashMsg } from './index';
import { constant, sessionManager } from '../shared/index';

class Layout extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isSession: false,
            isHomePage: false,
            showHeader: false, // variable to show header
            currentPage: null,
            noHeaderUrlsArray: [
                'sign-in',
                'sign-up',
                'forgot-password',
                'reset-password',
                'verify-email',
            ],
            headerKey: 0,
            logoImage: null,
            isTransHeader: false,
        };
        this.forceUpdateHeader = this.forceUpdateHeader.bind(this);
    }

    componentDidMount() {
        browserHistory.listen(location => {
            this.setState(
                { isSession: sessionManager.isSession() },
                function () {
                    let logoImage, isTransHeader;
                    if (location.pathname !== constant['ROUTES_PATH']['HOME']) {
                        logoImage = constant['IMG_PATH'] + 'logo@2x.png';
                        isTransHeader = false;
                    } else {
                        logoImage = constant['IMG_PATH'] + 'logo-white@2x.png';
                        isTransHeader = true;
                    }
                    this.setState(
                        {
                            showHeader: !this.state.noHeaderUrlsArray.includes(
                                // comment out from here
                                location.pathname.split('/')[1]
                            ), // to here to keep header state constaht
                            currentPage: location.pathname,
                            logoImage: logoImage,
                            isTransHeader: isTransHeader,
                        },
                        function () {
                            if ($('.hamburger-icon:visible').length) {
                                $('#legably_logo').removeClass('ml-0');
                            } else {
                                $('#legably_logo').addClass('ml-0');
                            }
                        }
                    );
                }
            );
        });
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    handleScroll(event) {
        let scrollTop = event.target.body.scrollTop;
        let currentPage = this.state.currentPage;
        if (currentPage === constant['ROUTES_PATH']['HOME']) {
            if (scrollTop > 0) {
                this.setState({
                    logoImage: constant['IMG_PATH'] + 'logo@2x.png',
                    isTransHeader: false,
                });
            } else {
                this.setState({
                    logoImage: constant['IMG_PATH'] + 'logo-white@2x.png',
                    isTransHeader: true,
                });
            }
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    forceUpdateHeader() {
        this.setState({
            headerKey: Math.random(),
        });
    }

    render() {
        const { custom } = this.props;
        const { children } = this.props;
        var childrenWithProps = React.Children.map(children, child =>
            React.cloneElement(child, {
                forceUpdateHeader: this.forceUpdateHeader,
                session: this.state.isSession,
            })
        );

        return (
            <html>
                <head>
                    <meta
                        name='viewport'
                        content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
                    />
                    <meta
                        name='Description'
                        content={
                            constant['SEO_META_INFO']['DESC'][
                            this.props.location.pathname
                            ] || ''
                        }
                    />

                    <title>
                        {constant['SEO_META_INFO']['TITLE'][
                            this.props.location.pathname
                        ] || 'Legably'}
                    </title>

                    <link rel='icon' type='image/x-icon' href='/favicon.ico' />

                    {/*<link rel="stylesheet" href="/styles/style.css" />*/}
                    <link rel='stylesheet' href='/bundle.css' />

                    <link href="https://unpkg.com/ionicons@4.5.0/dist/css/ionicons.min.css" rel="stylesheet">

                    </link>
                    <script src='//cdn.polyfill.io/v2/polyfill.min.js'></script>
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PCMQF69');`,
                        }}
                    />
                </head>
                <body>
                    <noscript
                        dangerouslySetInnerHTML={{
                            __html: `
            <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PCMQF69" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
                        }}
                    />

                    {this.state.showHeader ? (
                        <LegablyHeader
                            headerKey={this.state.headerKey}
                            session={this.state.isSession}
                            homepage={this.state.isHomePage}
                            currentPage={this.state.currentPage}
                            logoImage={this.state.logoImage}
                            isTransHeader={this.state.isTransHeader}
                        />
                    ) : null}

                    {childrenWithProps}

                    <LegablyFooter session={this.state.isSession} />

                    <Loader />

                    <FlashMsg />

                    <script
                        dangerouslySetInnerHTML={{
                            __html: 'window.PROPS=' + JSON.stringify(custom),
                        }}
                    />

                    <script src='/js/jquery.min.js'></script>
                    <script src='/js/bootstrap.min.js'></script>
                    <script
                        src='https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit'
                        async
                        defer
                    ></script>
                    <script src='//propeller.in/components/select2/js/select2.full.js'></script>
                    <script src='//propeller.in/components/range-slider/js/wNumb.js'></script>
                    <script src='//propeller.in/components/range-slider/js/nouislider.js'></script>
                    <script src='//cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.10/jquery.mask.js'></script>
                    <script src='/js/custom.js'></script>
                    <script src="https://js.stripe.com/v3/"></script>
                    <script src='/bundle.js'></script>
                </body>
            </html>
        );
    }
}

const wrapper = connect(state => {
    return { custom: state };
});

export default Layout;

Layout.contextTypes = {
    router: PropTypes.object,
};
