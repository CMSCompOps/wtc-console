import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';

import * as actionCreators from '../../actions/data';
import getListDataType from '../../types/ListData';
import WorkflowType from '../../types/Workflow';
import DataTable from '../../components/DataTable';
import {getReadableTimestamp} from '../../utils/dates';

class WorkflowsView extends React.Component {
    static propTypes = {
        isFetching: PropTypes.bool.isRequired,
        data: getListDataType(WorkflowType),
        token: PropTypes.string.isRequired,
        actions: PropTypes.shape({
            fetchWorkflows: PropTypes.func.isRequired,
        }).isRequired
    };

    static defaultProps = {
        data: '',
    };

    componentWillMount() {
        const {token} = this.props;
        this.props.actions.fetchWorkflows(token, 2, 20);
    }

    onChangePage = (page) => {
        const {token} = this.props;
        this.props.actions.fetchWorkflows(token, page, 20);
    };

    render() {
        const {isFetching, data} = this.props;

        console.log('received workflows',);

        return (
            <div className="protected">
                <div className="container">
                    <h1 className="text-center margin-bottom-medium">Workflows</h1>
                    {isFetching || !data
                        ? <p className="text-center">Loading data...</p>
                        : <DataTable
                            data={data}
                            columns={[
                                {key: 'name', title: 'Workflow', width: '45%'},
                                {key: 'prep.name', title: 'Prep'},
                                {key: 'prep.campaign', title: 'Campaign'},
                                {key: 'updated', title: 'Last updated', width: '150px', transformFn: getReadableTimestamp},
                            ]}
                            onChangePage={this.onChangePage}
                        />
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.data.data,
        isFetching: state.data.isFetching
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actionCreators, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkflowsView);
export {WorkflowsView as WorkflowsViewNotConnected};
