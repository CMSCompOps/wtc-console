import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {withRouter} from 'react-router';

import WorkflowType from '../../types/Workflow';
import Site from '../../types/Site';
import * as actionCreators from '../../actions/data';
import {getReadableTimestamp} from '../../utils/dates';
import DataTable from '../../components/DataTable';
import NavHeader from '../../components/NavHeader';
import Select from '../../components/Select';
import {sortItems} from '../../utils/sort';


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

const SitesAndActionsContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

const SectionTitle = styled.h4`
    text-align: center;
    margin-bottom: 10px;
`;

const Section = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    
    &:last-child {
        margin-right: 0;
    }
`;

const Label = styled.div`
    padding-bottom: 10px;
`;

const FormField = styled.div`
    padding-bottom: 10px;
`;

const Sites = Section.extend`
    flex: 2;
`;

const Actions = Section.extend`
    flex: 1;
`;

const ACTIONS = [
    {value: 'none', label: 'None'},
    {value: 'clone', label: 'Kill and Clone'},
    {value: 'acdc', label: 'ACDC'},
    {value: 'recovery', label: 'Recovery (not ACDC)'},
    {value: 'special', label: 'Other action'},
];

const METHODS = [
    {value: 'Auto', label: 'Auto'},
    {value: 'Manual', label: 'Manual'},
    {value: 'Ban', label: 'Ban'},
];

class WorkflowView extends React.Component {

    static propTypes = {
        workflow: PropTypes.shape({
            isFetching: PropTypes.bool.isRequired,
            data: WorkflowType,
        }),
        sites: PropTypes.shape({
            isFetching: PropTypes.bool.isRequired,
            data: PropTypes.arrayOf(Site),
        }),
        token: PropTypes.string.isRequired,
        actions: PropTypes.shape({
            fetchWorkflow: PropTypes.func.isRequired,
            fetchSites: PropTypes.func.isRequired,
        }).isRequired,
        match: PropTypes.object.isRequired,
    };

    static defaultProps = {
        data: null,
    };

    constructor(props) {
        super(props);

        this.state = {
            taskActions: {},
            sortedBy: null,
            desc: false,
        };
    }

    componentWillMount() {
        const {token, match} = this.props;
        this.props.actions.fetchWorkflow(token, match.params.id);
        this.props.actions.fetchSites(token);
    }

    sortData = (key, desc) => {
        this.setState({
            ...this.state,
            sortedBy: key,
            desc: desc,
        });
    };

    getSortedTasks = () => {
        const {workflow} = this.props;
        const {sortedBy, desc} = this.state;

        return sortItems(workflow.data.tasks, sortedBy, desc);
    };

    foldedStatusContentRenderer = (row, id) => <p><strong>Dataset:</strong>{row.dataset}</p>;

    renderSites = (row) => {
        return (
            <Sites>
                <SectionTitle>Sites</SectionTitle>
                <DataTable
                    data={row.statuses}
                    folding={true}
                    foldedContentRenderer={this.foldedStatusContentRenderer}
                    idColumn={'site'}
                    columns={[
                        {key: 'site', title: 'Site', flex: 1},
                        {key: 'success_count', title: 'Completed', width: '110px'},
                        {key: 'failed_count', title: 'Failed', width: '110px'},
                    ]}
                />
            </Sites>
        );
    };

    onActionDataChange = (taskId, key, value) => {
        const {taskActions} = this.state;
        const taskAction = taskActions[taskId] || {};

        this.setState({
            ...this.state,
            taskActions: {
                ...taskActions, [taskId]: {...taskAction, [key]: value},
            },
        });
    };

    showMethodsSelect = (action) => action && (action.value === 'acdc' || action.value === 'recovery');

    renderActions = (taskId) => {
        const {taskActions} = this.state;
        const taskAction = taskActions[taskId] || {};

        return (
            <Actions>
                <SectionTitle>Action</SectionTitle>
                <div>
                    <FormField>
                        <Select
                            value={taskAction.name}
                            onChange={(action) => this.onActionDataChange(taskId, 'name', action)}
                            options={ACTIONS}/>
                    </FormField>
                    {this.showMethodsSelect(taskAction.name) && (
                        <div>
                            <Label>Method:</Label>
                            <FormField>
                                <Select
                                    value={taskAction.method}
                                    onChange={(method) => this.onActionDataChange(taskId, 'method', method)}
                                    options={METHODS}/>
                            </FormField>
                        </div>
                    )}
                </div>
            </Actions>
        );
    };

    foldedTaskContentRenderer = (row, id) => {
        return (
            <SitesAndActionsContainer>
                {this.renderSites(row)}
                {this.renderActions(id)}
            </SitesAndActionsContainer>
        )
    };

    renderWorkflowDetails = (workflow) => {
        return (
            <Fields>
                <Field>
                    <Title>Name:</Title>
                    <Value>{workflow.name}</Value>
                </Field>
                {workflow.prep && <Field>
                    <Title>Prep:</Title>
                    <Value>{workflow.prep.name}</Value>
                </Field>}
                {workflow.prep && <Field>
                    <Title>Campaign:</Title>
                    <Value>{workflow.prep.campaign}</Value>
                </Field>}
                {workflow.prep && <Field>
                    <Title>Priority:</Title>
                    <Value>{workflow.prep.priority}</Value>
                </Field>}
                <Field>
                    <Title>Created:</Title>
                    <Value>{getReadableTimestamp(workflow.created)}</Value>
                </Field>
                <Field>
                    <Title>Updated:</Title>
                    <Value>{getReadableTimestamp(workflow.updated)}</Value>
                </Field>
            </Fields>
        );
    };

    render() {
        const {workflow, sites} = this.props;
        const {sortedBy, desc, expandedTasks} = this.state;

        return (
            <div className="protected">
                <div className="container">
                    <NavHeader title={'Workflow'}/>
                    {workflow.isFetching || !workflow.data || sites.isFetching
                        ? <p className="text-center">Loading data...</p>
                        : <Details>
                            {this.renderWorkflowDetails(workflow.data)}

                            <DataTable
                                data={this.getSortedTasks()}
                                title={'Tasks'}
                                columns={[
                                    {key: 'name', title: 'Name', flex: 1},
                                    {key: 'job_type', title: 'Job type', width: '100px'},
                                    {key: 'failures_count', title: 'Failed', width: '70px', align: 'right'},
                                    {
                                        key: 'created',
                                        title: 'Created',
                                        width: '150px',
                                        transformFn: getReadableTimestamp,
                                        align: 'right',
                                    },
                                    {
                                        key: 'updated',
                                        title: 'Updated',
                                        width: '150px',
                                        transformFn: getReadableTimestamp,
                                        align: 'right',
                                    },
                                ]}
                                folding={true}
                                foldedContentRenderer={this.foldedTaskContentRenderer}
                                expandedIds={expandedTasks}
                                idColumn={'name'}
                                onChangePage={this.onChangePage}
                                sortFn={this.sortData}
                                sortedBy={sortedBy}
                                desc={desc}
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
        workflow: {
            data: state.workflow.data,
            isFetching: state.workflow.isFetching
        },
        sites: {
            data: state.sites.data,
            isFetching: state.sites.isFetching
        },
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actionCreators, dispatch)
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WorkflowView));
export {WorkflowView as WorkflowViewNotConnected};
