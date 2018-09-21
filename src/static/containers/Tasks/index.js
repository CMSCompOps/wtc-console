import React from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import qs from 'query-string';
import Toggle from 'react-toggle';

import * as actionCreators from '../../actions/data';
import Task from '../../types/Task';
import Site from '../../types/Site';
import PagedDataTable from '../../components/PagedDataTable';
import {getReadableTimestamp} from '../../utils/dates';
import {getUrlParamsString} from '../../utils/url';
import Filter from '../../components/Filter';
import getListDataType from '../../types/ListData';
import SelectField from '../../components/fields/SelectField';
import CheckboxField from '../../components/fields/CheckboxField';
import TextInput from '../../components/fields/TextInput';
import Button from '../../components/Button';
import SliderField from '../../components/fields/SliderField';


const DEFAULT_PAGE_SIZE = 20;
const PATH = '/tasks';

const SPLITTING_MARKS = ['2x', '3x', '10x', '20x', '50x', '100x', '200x', 'max'];

const ACTIONS = [
    {value: 'none', label: 'None'},
    {value: 'clone', label: 'Kill and Clone'},
    {value: 'acdc', label: 'ACDC'},
    {value: 'recovery', label: 'Recovery (not ACDC)'},
    {value: 'special', label: 'Other action'},
];

const METHODS = [
    {value: 'auto', label: 'Auto'},
    {value: 'manual', label: 'Manual'},
];

const Details = styled.div`
    width: 100%;
    padding-bottom: 20px;
`;

const SitesAndActionsContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

const Section = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
    margin-right: 15px;
`;

const Label = styled.div`
    padding: ${props => props.inline ? '0 10px 0 0' : '0 0 10px 0'};
`;

const FormField = styled.div`
    padding-bottom: 10px;
`;

const FormFieldInline = styled(FormField)`
    display: flex;
    align-items: center;
`;

const Sites = styled(Section)`
    flex: 3;
`;

const SitesList = styled(Section)`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
`;

const SiteField = styled.div`
    width: 220px;
`;

const SiteLabel = styled.label`
    font-size: 12px;
    word-break: break-all;
    font-weight: ${props => props.bold ? 'bold' : 'normal'};
    cursor: pointer;
    margin-left: 3px;
`;

const Actions = styled(Section)`
    flex: 1;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`;

const ActionBlock = styled(Section)`
    flex: 1;
    min-width: 200px;
    max-width: 300px;
`;

const ReasonsForm = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
`;

const ReasonItem = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
`;

class TasksView extends React.Component {

    static propTypes = {
        tasks: PropTypes.shape({
            isFetching: PropTypes.bool.isRequired,
            data: getListDataType(Task),
        }),
        sites: PropTypes.shape({
            isFetching: PropTypes.bool.isRequired,
            data: PropTypes.arrayOf(Site),
        }),
        tasksActions: PropTypes.shape({
            isFetching: PropTypes.bool.isRequired,
            data: PropTypes.array,
        }),
        actions: PropTypes.shape({
            fetchTasks: PropTypes.func.isRequired,
            fetchSites: PropTypes.func.isRequired,
            fetchTasksActions: PropTypes.func.isRequired,
            saveTasksActions: PropTypes.func.isRequired,
        }).isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    static defaultProps = {
        data: null,
    };

    constructor(props) {
        super(props);

        const params = qs.parse(props.location.search);

        this.state = {
            reasons: [],
            taskActions: {},
            page: params.page || 1,
            filter: params.filter || '',
            sortedBy: params.sortedBy,
            desc: !!params.desc,
        };
    }

    componentDidMount() {
        this.props.actions.fetchSites();
        this.fetchData();

    }

    fetchData = () => {
        const {page, filter, sortedBy, desc} = this.state;
        this.props.actions.fetchTasks(page, DEFAULT_PAGE_SIZE, filter, sortedBy, desc);
        this.props.actions.fetchTasksActions();
    };

    updateLocation = () => {
        const {page, filter, sortedBy, desc} = this.state;

        let params = getUrlParamsString({page, filter, sortedBy, desc});

        if (params) {
            this.props.history.replace(`${PATH}?${params}`);
        } else {
            this.props.history.replace(PATH);
        }
    };

    updateLocationAndFetchData = () => {
        this.updateLocation();
        this.fetchData();
    };

    filter = (value) => {
        this.setState({
            ...this.state,
            page: 1,
            filter: value,
        }, this.updateLocationAndFetchData);
    };

    sortData = (sortedBy, desc) => {
        this.setState({
            ...this.state,
            page: 1,
            sortedBy,
            desc,
        }, this.updateLocationAndFetchData);
    };

    onChangePage = (page) => {
        this.setState({
            ...this.state,
            page,
        }, this.updateLocationAndFetchData);
    };

    onActionDataChange = (taskId, newValues) => {
        const {taskActions} = this.state;

        this.setState({
            ...this.state,
            taskActions: {
                ...taskActions,
                [taskId]: {
                    ...this.getTaskActionsById(taskId),
                    ...newValues,
                },
            },
        });
    };

    getTaskActionsById = (taskId) => {
        const {taskActions} = this.state;
        return taskActions[taskId] || {};
    };

    onSiteCheckboxClick = (taskId, siteName, checked) => {
        const taskAction = this.getTaskActionsById(taskId);
        const {sites} = taskAction;

        let newSites = new Set(sites);

        checked
            ? newSites.add(siteName)
            : newSites.delete(siteName);

        this.onActionDataChange(taskId, {'sites': newSites});
    };

    renderSites = (taskId, taskAction, taskSites) => {
        const {sites: allSites} = this.props;

        return (
            <Sites>
                <Label>Choose sites:</Label>
                <SitesList>
                    {allSites.data.map(site => {
                        const checkboxId = `${taskId}_${site.name}`;

                        return (
                            <SiteField key={checkboxId}>
                                <CheckboxField
                                    label={<SiteLabel bold={taskSites.includes(site.name)}>{site.name}</SiteLabel>}
                                    checked={taskAction.sites && taskAction.sites.has(site.name)}
                                    handleChange={newValue => this.onSiteCheckboxClick(taskId, site.name, newValue)}
                                />
                            </SiteField>
                        )
                    })}
                </SitesList>
            </Sites>
        );
    };

    isActionSelected = (taskAction) => !!taskAction && !!taskAction.name && !!taskAction.name.value;

    shouldShowMethodsSelect = (taskAction) =>
        this.isActionSelected(taskAction)
        && (taskAction.name.value === 'acdc' || taskAction.name.value === 'recovery');


    shouldShowParameters = (taskAction) =>
        this.isActionSelected(taskAction)
        && taskAction.name.value !== 'none';

    renderActionParameters = (taskId, taskAction) => {
        return (
            <ActionBlock>
                <FormFieldInline>
                    <Label inline>XRootD:</Label>
                    <Toggle checked={taskAction.xrootd}
                            onChange={e => this.onActionDataChange(taskId, {'xrootd': e.target.checked})}/>
                </FormFieldInline>
                <FormFieldInline>
                    <Label inline>Secondary:</Label>
                    <Toggle checked={taskAction.secondary}
                            onChange={e => this.onActionDataChange(taskId, {'secondary': e.target.checked})}/>
                </FormFieldInline>
                <FormField>
                    <Label>Splitting:</Label>
                    <SliderField marks={SPLITTING_MARKS} max={7} step={null} included={false}
                                 onChange={s => this.onActionDataChange(taskId, {'splitting': s})}/>
                </FormField>
            </ActionBlock>
        );
    };

    renderActionParameters2 = (taskId, taskAction) => {
        return (
            <ActionBlock>
                <FormFieldInline>
                    <Label inline>Memory:</Label>
                    <TextInput value={taskAction.memory}
                               onChange={e => this.onActionDataChange(taskId, {'memory': e.target.value})}/>
                </FormFieldInline>
                <FormFieldInline>
                    <Label inline>Cores:</Label>
                    <TextInput value={taskAction.cores}
                               onChange={e => this.onActionDataChange(taskId, {'cores': e.target.value})}/>
                </FormFieldInline>
                <FormFieldInline>
                    <Label inline>Group:</Label>
                    <TextInput value={taskAction.group}
                               onChange={e => this.onActionDataChange(taskId, {'group': e.target.value})}/>
                </FormFieldInline>
            </ActionBlock>
        );
    };

    renderActions = (taskId, taskAction, row) => {
        return (
            <Actions>
                <ActionBlock>
                    <FormField>
                        <Label>Choose an action:</Label>
                        <SelectField
                            value={taskAction.name}
                            onChange={action => this.onActionDataChange(taskId, {'task': row, 'name': action})}
                            options={ACTIONS}/>
                    </FormField>
                    {this.shouldShowMethodsSelect(taskAction) && (
                        <div>
                            <Label>Method:</Label>
                            <FormField>
                                <SelectField
                                    value={taskAction.method}
                                    onChange={method => this.onActionDataChange(taskId, {'method': method})}
                                    options={METHODS}/>
                            </FormField>
                        </div>
                    )}
                </ActionBlock>
                {this.shouldShowParameters(taskAction) && this.renderActionParameters(taskId, taskAction)}
                {this.shouldShowParameters(taskAction) && this.renderActionParameters2(taskId, taskAction)}
            </Actions>
        );
    };

    getTaskSitesNames = (task) => {
        return task.statuses.map(status => status.site);
    };

    shouldShowSites = (taskAction) =>
        this.shouldShowMethodsSelect(taskAction)
        && taskAction.method
        && taskAction.method.value !== 'Auto';

    foldedTaskContentRenderer = (row, taskId) => {
        const taskAction = this.getTaskActionsById(taskId);
        return (
            <SitesAndActionsContainer>
                {this.renderActions(taskId, taskAction, row)}
                {this.shouldShowSites(taskAction) && this.renderSites(taskId, taskAction, this.getTaskSitesNames(row))}
            </SitesAndActionsContainer>
        )
    };

    addReason = () => {
        const {reasons} = this.state;

        this.setState({
            ...this.state,
            reasons: [...reasons, ''],
        });
    };

    removeReason = (idx) => {
        const {reasons} = this.state;

        this.setState({
            ...this.state,
            reasons: reasons.filter((reason, i) => i !== idx),
        });
    };

    onReasonChange = (value, idx) => {
        const {reasons} = this.state;

        this.setState({
            ...this.state,
            reasons: reasons.map((reason, i) => i === idx ? value : reason),
        });
    };

    getTaskSites = (task) => task.statuses.map(status => status.site);

    formatTaskActionForUnified = (taskAction, reasons) => {

        if (!taskAction.task)
            return {};

        const method = _.get(taskAction, 'method.value') || 'auto';

        return {
            name: taskAction.task.name,
            workflow: taskAction.task.workflow.name,
            action_id: {
                action: _.get(taskAction, 'name.value'),
                xrootd: taskAction.xrootd ? 'enabled' : 'disabled',
                secondary: taskAction.secondary ? 'enabled' : 'disabled',
                splitting: taskAction.splitting,
                cores: taskAction.cores,
                memory: taskAction.memory,
                group: taskAction.group,
                sites: method === 'manual' ? taskAction.sites : this.getTaskSites(taskAction.task),
                reasons: reasons,
            }
        }
    };

    shouldAddTaskAction = (taskAction) => {
        const actionName = _.get(taskAction, 'name.value');
        return !!taskAction.task && !!actionName && actionName !== 'none';
    };

    submitActions = () => {
        const {reasons, taskActions} = this.state;

        const unifiedActions = Object.values(taskActions)
            .filter(this.shouldAddTaskAction)
            .map(taskAction => this.formatTaskActionForUnified(taskAction, reasons));

        this.props.actions.saveTasksActions(unifiedActions);
    };

    renderReasonsForm = () => {
        const {reasons} = this.state;

        return (
            <ReasonsForm>
                {reasons.map((reason, idx) =>
                    <ReasonItem key={`reason_${idx}`}>
                        <TextInput value={reason} onChange={e => this.onReasonChange(e.target.value, idx)}/>
                        <Button onClick={() => this.removeReason(idx)} title={'Remove reason'}/>
                    </ReasonItem>
                )}
                <Button onClick={this.addReason} title={'Add reason'}/>
                <Button onClick={this.submitActions} title={'Submit actions'}/>
            </ReasonsForm>
        );
    };

    render() {
        const {tasks, sites} = this.props;
        const {filter, sortedBy, desc, expandedTasks} = this.state;

        return (
            <div className="protected">
                <div className="container">
                    <h2 className="text-center margin-bottom-medium">Tasks</h2>

                    <Filter onFilter={this.filter} initialValue={filter}/>

                    {tasks.isFetching || sites.isFetching || !tasks.data
                        ? <p className="text-center">Loading data...</p>
                        : <Details>
                            <PagedDataTable
                                data={tasks.data}
                                columns={[
                                    {key: 'name', title: 'Task', flex: 3},
                                    {key: 'workflow.name', title: 'Workflow', flex: 2},
                                    {key: 'prep.name', title: 'Prep', flex: 1},
                                    {key: 'prep.campaign', title: 'Campaign', flex: 1},
                                    {key: 'prep.priority', title: 'Priority', width: '80px', align: 'right'},
                                    {key: 'failures_count', title: 'Failures', width: '90px', align: 'right'},
                                    {
                                        key: 'updated',
                                        title: 'Last updated',
                                        width: '150px',
                                        transformFn: getReadableTimestamp,
                                        align: 'right',
                                    },
                                ]}
                                onChangePage={this.onChangePage}
                                idColumn={'name'}
                                folding={true}
                                foldedContentRenderer={this.foldedTaskContentRenderer}
                                expandedIds={expandedTasks}
                                sortFn={this.sortData}
                                sortedBy={sortedBy}
                                desc={desc}
                            />
                            {this.renderReasonsForm()}
                        </Details>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        tasks: {
            data: state.tasks.data,
            isFetching: state.tasks.isFetching
        },
        sites: {
            data: state.sites.data,
            isFetching: state.sites.isFetching
        },
        tasksActions: {
            data: state.tasksActions.data,
            isFetching: state.tasksActions.isFetching
        },
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actionCreators, dispatch)
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TasksView));
export {TasksView as PrepsViewNotConnected};
