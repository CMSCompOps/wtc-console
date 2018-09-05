import React from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './styles/main.scss';

class App extends React.Component {
    static propTypes = {
        children: PropTypes.shape().isRequired,
        dispatch: PropTypes.func.isRequired,
        location: PropTypes.shape({
            pathname: PropTypes.string
        })
    };

    static defaultProps = {
        location: undefined
    };

    goToIndex = () => {
        this.props.dispatch(push('/'));
    };

    goToTasks = () => {
        this.props.dispatch(push('/tasks'));
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
        const tasksClass = classNames({
            active: this.props.location && this.props.location.pathname === '/tasks'
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
                            <ul className="nav navbar-nav navbar-right">
                                <li className={tasksClass}>
                                    <a className="js-go-to-protected-button" onClick={this.goToTasks}>
                                        Tasks
                                    </a>
                                </li>
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
                            </ul>
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
        location: state.routing.location
    };
};

export default connect(mapStateToProps)(App);
export {App as AppNotConnected};
