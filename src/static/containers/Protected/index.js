import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as actionCreators from '../../actions/data';
import getListDataType from '../../types/ListData';
import WorkflowType from '../../types/Workflow';
import DataTable from '../../components/DataTable';

class ProtectedView extends React.Component {
    static propTypes = {
        isFetching: PropTypes.bool.isRequired,
        data: getListDataType(WorkflowType),
        token: PropTypes.string.isRequired,
        actions: PropTypes.shape({
            fetchWorkflows: PropTypes.func.isRequired
        }).isRequired
    };

    static defaultProps = {
        data: '',
    };

    componentWillMount() {
        const { token } = this.props;
        this.props.actions.fetchWorkflows(token, 2, 30);
    }

    onChangePage = (page, pageSize) => {
        const { token } = this.props;
        this.props.actions.fetchWorkflows(token, page, pageSize);
    };

    render() {
        const { isFetching, data } = this.props;

        console.log('received workflows', );

        return (
            <div className="protected">
                <div className="container">
                    <h1 className="text-center margin-bottom-medium">Protected</h1>
                    {!data
                        ? <p className="text-center">Loading data...</p>
                        : <div>
                            <p>Data received from the server:</p>
                            <b>{data.pages}</b>
                            <br/>
                            <b>{data.current}</b>
                            <br/>
                            <b>{data.total}</b>
                            <br/>
                            <DataTable
                                data={data}
                                columns={['name', 'prep', 'created', 'updated']}
                                onChangePage={this.onChangePage}
                            />
                        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProtectedView);
export { ProtectedView as ProtectedViewNotConnected };
