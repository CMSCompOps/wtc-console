import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import * as actionCreators from '../../actions/data';
import getListDataType from '../../types/ListData';
import WorkflowsType from '../../types/Workflows';
import PagedDataTable from '../../components/PagedDataTable';
import {getReadableTimestamp} from '../../utils/dates';

const DEFAULT_PAGE_SIZE = 20;
class WorkflowsView extends React.Component {

    static propTypes = {
        isFetching: PropTypes.bool.isRequired,
        data: getListDataType(WorkflowsType),
        token: PropTypes.string.isRequired,
        actions: PropTypes.shape({
            fetchWorkflows: PropTypes.func.isRequired,
        }).isRequired,
        history: PropTypes.object.isRequired,
    };

    static defaultProps = {
        data: null,
    };

    constructor(props) {
        super(props);

        this.state = {
            sortedBy: null,
            desc: false,
        };
    }

    componentWillMount() {
        const {token} = this.props;
        this.props.actions.fetchWorkflows(token, 1, DEFAULT_PAGE_SIZE);
    }

    sortData = (key, desc) => {
        const {token} = this.props;
        this.props.actions.fetchWorkflows(token, 1, DEFAULT_PAGE_SIZE, key, desc);

        this.setState({
            ...this.state,
            sortedBy: key,
            desc: desc,
        });
    };

    goToDetails = (id) => {
        this.props.history.push(`/workflows/${id}`);
    };

    onChangePage = (page) => {
        const {token} = this.props;
        this.props.actions.fetchWorkflows(token, page, DEFAULT_PAGE_SIZE);
    };

    render() {
        const {isFetching, data} = this.props;
        const {sortedBy, desc} = this.state;

        return (
            <div className="protected">
                <div className="container">
                    <h1 className="text-center margin-bottom-medium">Workflows</h1>
                    {isFetching || !data
                        ? <p className="text-center">Loading data...</p>
                        : <PagedDataTable
                            data={data}
                            columns={[
                                {key: 'name', title: 'Workflow', width: '45%'},
                                {key: 'prep.name', title: 'Prep'},
                                {key: 'prep.campaign', title: 'Campaign'},
                                {key: 'updated', title: 'Last updated', width: '150px', transformFn: getReadableTimestamp},
                            ]}
                            onChangePage={this.onChangePage}
                            idColumn={'name'}
                            onClickFn={this.goToDetails}
                            sortFn={this.sortData}
                            sortedBy={sortedBy}
                            desc={desc}
                        />
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.workflows.data,
        isFetching: state.workflows.isFetching
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actionCreators, dispatch)
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WorkflowsView));
export {WorkflowsView as WorkflowsViewNotConnected};
