import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'react-router';

import WorkflowType from '../../types/Workflow';
import * as actionCreators from '../../actions/data';
import {getReadableTimestamp} from '../../utils/dates';
import DataTable from '../../components/DataTable';


const Details = styled.div`
    width: 100%;
    padding-bottom: 20px;
`;

const Fields = styled.div`
    width: 100%;
    padding-bottom: 20px;
`;

const Field = styled.div`
    width: 100%;
`;

const Title = styled.p`
    display: inline-block;
    width: 100px;
    font-size: 14px;
    font-weight: bold;
`;

const Value = styled.p`
    display: inline-block;
    font-size: 14px;
`;

class WorkflowView extends React.Component {

    static propTypes = {
        isFetching: PropTypes.bool.isRequired,
        data: WorkflowType,
        token: PropTypes.string.isRequired,
        actions: PropTypes.shape({
            fetchWorkflow: PropTypes.func.isRequired,
        }).isRequired,
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    };

    static defaultProps = {
        data: null,
    };

    componentWillMount() {
        const {token, match} = this.props;
        console.log('Match:', match);
        this.props.actions.fetchWorkflow(token, match.params.id);
    }

    render() {
        const {isFetching, data} = this.props;

        return (
            <div className="protected">
                <div className="container">
                    <h1 className="text-center margin-bottom-medium">Workflow</h1>
                    {isFetching || !data
                        ? <p className="text-center">Loading data...</p>
                        : <Details>
                            <Fields>
                                <Field>
                                    <Title>Name:</Title>
                                    <Value>{data.name}</Value>
                                </Field>
                                <Field>
                                    <Title>Prep:</Title>
                                    <Value>{data.prep.name}</Value>
                                </Field>
                                <Field>
                                    <Title>Campaign:</Title>
                                    <Value>{data.prep.campaign}</Value>
                                </Field>
                                <Field>
                                    <Title>Created:</Title>
                                    <Value>{getReadableTimestamp(data.created)}</Value>
                                </Field>
                                <Field>
                                    <Title>Updated:</Title>
                                    <Value>{getReadableTimestamp(data.updated)}</Value>
                                </Field>
                            </Fields>
                            <DataTable
                                data={data.statuses}
                                columns={[
                                    {key: 'site', title: 'Site'},
                                    {key: 'success_count', title: 'Completed', width: '100px'},
                                    {key: 'failed_count', title: 'Failed', width: '100px'},
                                ]}
                                onChangePage={this.onChangePage}
                            />
                        </Details>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.workflow.data,
        isFetching: state.workflow.isFetching
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actionCreators, dispatch)
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WorkflowView));
export {WorkflowView as WorkflowViewNotConnected};
