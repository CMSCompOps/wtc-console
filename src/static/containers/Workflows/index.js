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

    componentWillMount() {
        const {token} = this.props;
        this.props.actions.fetchWorkflows(token, 1, 20);
    }

    goToDetails = (id) => {
        this.props.history.push(`/workflows/${id}`);
    };

    onChangePage = (page) => {
        const {token} = this.props;
        this.props.actions.fetchWorkflows(token, page, 20);
    };

    render() {
        const {isFetching, data} = this.props;

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
