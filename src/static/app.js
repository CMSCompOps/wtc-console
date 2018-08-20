import React from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import {authLogoutAndRedirect} from './actions/auth';
import './styles/main.scss';

class App extends React.Component {
    static propTypes = {
        isAuthenticated: PropTypes.bool.isRequired,
        children: PropTypes.shape().isRequired,
        dispatch: PropTypes.func.isRequired,
        location: PropTypes.shape({
            pathname: PropTypes.string
        })
    };

    static defaultProps = {
        location: undefined
    };

    logout = () => {
        this.props.dispatch(authLogoutAndRedirect());
    };

    goToIndex = () => {
        this.props.dispatch(push('/'));
    };

    goToPreps = () => {
        this.props.dispatch(push('/preps'));
    };

    goToWorkflows = () => {
        this.props.dispatch(push('/workflows'));
    };

    render() {
        const homeClass = classNames({
            active: this.props.location && this.props.location.pathname === '/'
        });
        const workflowsClass = classNames({
            active: this.props.location && this.props.location.pathname === '/workflows'
        });
        const prepsClass = classNames({
            active: this.props.location && this.props.location.pathname === '/preps'
        });

        return (
            <div className="app">
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <button
                                type="button"
                                className="navbar-toggle collapsed"
                                data-toggle="collapse"
                                data-target="#top-navbar"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"/>
                                <span className="icon-bar"/>
                                <span className="icon-bar"/>
                            </button>
                            <a className="navbar-brand" onClick={this.goToIndex}>
                                WTC Console
                            </a>
                        </div>
                        <div className="collapse navbar-collapse" id="top-navbar">
                            {this.props.isAuthenticated ?
                                <ul className="nav navbar-nav navbar-right">
                                    <li className={prepsClass}>
                                        <a className="js-go-to-protected-button" onClick={this.goToPreps}>
                                            Preps
                                        </a>
                                    </li>
                                    <li className={workflowsClass}>
                                        <a className="js-go-to-protected-button" onClick={this.goToWorkflows}>
                                            Workflows
                                        </a>
                                    </li>
                                    <li>
                                        <a className="js-logout-button" onClick={this.logout}>
                                            Logout
                                        </a>
                                    </li>
                                </ul>
                                :
                                <ul className="nav navbar-nav navbar-right">
                                    <li className={homeClass}>
                                        <a className="js-login-button" onClick={this.goToIndex}>
                                            <i className="fa fa-home"/> Login
                                        </a>
                                    </li>
                                </ul>
                            }
                        </div>
                    </div>
                </nav>

                <div>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        location: state.routing.location
    };
};

export default connect(mapStateToProps)(App);
export {App as AppNotConnected};
