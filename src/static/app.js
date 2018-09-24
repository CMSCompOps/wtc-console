import React from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './styles/main.scss';
import 'react-toggle/style.css';
import 'rc-slider/assets/index.css';

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
                            <a className="navbar-brand" onClick={this.goToTasks}>
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
