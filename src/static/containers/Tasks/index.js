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

const ActionAndSitesContainer = styled.div`
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

const ActionParameters = styled(Section)`
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
    width: 100%;
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
            actions: {},
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

    getActionByIdx = (idx) => {
        const {actions} = this.state;
        return actions[idx] || {};
    };

    onActionDataChange = (idx, newValues) => {
        const {actions} = this.state;

        this.setState({
            ...this.state,
            actions: {
                ...actions,
                [idx]: {
                    ...this.getActionByIdx(idx),
                    ...newValues,
                },
            },
        });
    };

    onSiteCheckboxClick = (idx, action, siteName, checked) => {
        const {sites} = action;

        let newSites = new Set(sites);

        checked
            ? newSites.add(siteName)
            : newSites.delete(siteName);

        this.onActionDataChange(idx, {'sites': newSites});
    };

    renderSites = (taskId, action, taskSites) => {
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
                                    checked={action.sites && action.sites.has(site.name)}
                                    handleChange={newValue => this.onSiteCheckboxClick(idx, action, site.name, newValue)}
                                />
                            </SiteField>
                        )
                    })}
                </SitesList>
            </Sites>
        );
    };

    isActionSelected = (action) => !!action && !!action.name && !!action.name.value;

    shouldShowMethodsSelect = (action) =>
        this.isActionSelected(action)
        && (action.name.value === 'acdc' || action.name.value === 'recovery');


    shouldShowParameters = (action) =>
        this.isActionSelected(action)
        && action.name.value !== 'none';

    renderActionParameters = (idx, action) => {
        return (
            <ActionBlock>
                <FormFieldInline>
                    <Label inline>XRootD:</Label>
                    <Toggle checked={action.xrootd}
                            onChange={e => this.onActionDataChange(idx, {'xrootd': e.target.checked})}/>
                </FormFieldInline>
                <FormFieldInline>
                    <Label inline>Secondary:</Label>
                    <Toggle checked={action.secondary}
                            onChange={e => this.onActionDataChange(idx, {'secondary': e.target.checked})}/>
                </FormFieldInline>
                <FormField>
                    <Label>Splitting:</Label>
                    <SliderField marks={SPLITTING_MARKS} max={7} step={null} included={false}
                                 onChange={s => this.onActionDataChange(idx, {'splitting': s})}/>
                </FormField>
            </ActionBlock>
        );
    };

    renderActionParameters2 = (idx, action) => {
        return (
            <ActionBlock>
                <FormFieldInline>
                    <Label inline>Memory:</Label>
                    <TextInput value={action.memory}
                               onChange={e => this.onActionDataChange(idx, {'memory': e.target.value})}/>
                </FormFieldInline>
                <FormFieldInline>
                    <Label inline>Cores:</Label>
                    <TextInput value={action.cores}
                               onChange={e => this.onActionDataChange(idx, {'cores': e.target.value})}/>
                </FormFieldInline>
                <FormFieldInline>
                    <Label inline>Group:</Label>
                    <TextInput value={action.group}
                               onChange={e => this.onActionDataChange(idx, {'group': e.target.value})}/>
                </FormFieldInline>
            </ActionBlock>
        );
    };

    renderActionForm = (idx, action, row) => {
        return (
            <ActionParameters>
                <ActionBlock>
                    <FormField>
                        <Label>Choose an action:</Label>
                        <SelectField
                            value={action.name}
                            onChange={action => this.onActionDataChange(idx, {'task': row, 'name': action})}
                            options={ACTIONS}/>
                    </FormField>
                    {this.shouldShowMethodsSelect(action) && (
                        <div>
                            <Label>Method:</Label>
                            <FormField>
                                <SelectField
                                    value={action.method}
                                    onChange={method => this.onActionDataChange(idx, {'method': method})}
                                    options={METHODS}/>
                            </FormField>
                        </div>
                    )}
                </ActionBlock>
                {this.shouldShowParameters(action) && this.renderActionParameters(idx, action)}
                {this.shouldShowParameters(action) && this.renderActionParameters2(idx, action)}
            </ActionParameters>
        );
    };

    getTaskSitesNames = (task) => {
        return task.statuses.map(status => status.site);
    };

    shouldShowSites = (action) =>
        this.shouldShowMethodsSelect(action)
        && action.method
        && action.method.value !== 'auto';

    addReason = (actionIdx, action) => {
        const {reasons} = action;
        this.onActionDataChange(actionIdx, {'reasons': [...reasons, '']});
    };

    removeReason = (actionIdx, action, reasonIdx) => {
        const {reasons} = action;
        this.onActionDataChange(actionIdx, {'reasons': reasons.filter((reason, i) => i !== reasonIdx)});
    };

    onReasonChange = (actionIdx, action, reasonIdx, value) => {
        const {reasons} = action;
        this.onActionDataChange(actionIdx, {'reasons': reasons.map((reason, i) => i === reasonIdx ? value : reason)});
    };

    renderActionReasons = (actionIdx, action) => {
        const reasons = action.reasons || [];

        return (
            <ReasonsForm>
                {reasons.map((reason, reasonIdx) =>
                    <ReasonItem key={`reason_${reasonIdx}`}>
                        <TextInput value={reason}
                                   onChange={e => this.onReasonChange(actionIdx, action, reasonIdx, e.target.value)}/>
                        <Button onClick={() => this.removeReason(actionIdx, action, reasonIdx)}
                                title={'Remove reason'}/>
                    </ReasonItem>
                )}
                <Button onClick={() => this.addReason(actionIdx, action)} title={'Add reason'}/>
            </ReasonsForm>
        );
    };

    renderAction = (idx, action) => {
        return (
            <ActionAndSitesContainer>
                {this.renderActionForm(idx, action, row)}
                {this.shouldShowSites(action) && this.renderSites(idx, action, this.getTaskSitesNames(row))}
                {this.renderActionReasons(idx, action)}
                // TODO: delete and add tasks buttons
                // TODO: list added tasks or message 'No tasks added, select tasks and click 'Apply to selected tasks' button'
            </ActionAndSitesContainer>
        )
    };

    foldedTaskContentRenderer = (row) => {
        return (
            <p>TODO: Render workflows indented</p>
        )
    };

    renderActions = () => {
        const {actions} = this.state;

        return (
            // TODO: render in data table
            <ActionAndSitesContainer>
                {Object.entries(actions).map(([idx, action]) => this.renderAction(idx, action))}

                // TODO: add action button
                <Button onClick={this.submitActions} title={'Submit actions'}/>
            </ActionAndSitesContainer>
        )
    };


    getTaskSites = (task) => task.statuses.map(status => status.site);

    formatTaskActionForUnified = (action) => {

        const method = _.get(action, 'method.value') || 'auto';

        return action.tasks.map(action => {
            return {
                name: action.task.name,
                workflow: action.task.workflow.name,
                action_id: {
                    action: _.get(action, 'name.value'),
                    xrootd: action.xrootd ? 'enabled' : 'disabled',
                    secondary: action.secondary ? 'enabled' : 'disabled',
                    splitting: action.splitting,
                    cores: action.cores,
                    memory: action.memory,
                    group: action.group,
                    sites: method === 'manual' ? action.sites : this.getTaskSites(action.task),
                    reasons: action.reasons,
                }
            }
        });
    };

    shouldAddTaskAction = (action) => {
        const actionName = _.get(action, 'name.value');
        return !!actionName && actionName !== 'none' && action.tasks;
    };

    submitActions = () => {
        const {actions} = this.state;

        const unifiedActions = Object.values(actions)
            .filter(this.shouldAddTaskAction)
            .flatMap(action => this.formatTaskActionForUnified(action));

        this.props.actions.saveTasksActions(unifiedActions);
    };

    render() {
        const {tasks, sites} = this.props;
        const {filter, sortedBy, desc, expandedTasks} = this.state;

        return (
            <div className="protected">
                <div className="container">
                    <h2 className="text-center margin-bottom-medium">Tasks</h2>

                    {this.renderActions()}

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
