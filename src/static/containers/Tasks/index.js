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
import {getUrlParamsString} from '../../utils/url';
import Filter from '../../components/Filter';
import getListDataType from '../../types/ListData';
import SelectField from '../../components/fields/SelectField';
import CheckboxField from '../../components/fields/CheckboxField';
import TextInput from '../../components/fields/TextInput';
import Button from '../../components/Button';
import SliderField from '../../components/fields/SliderField';
import DataTable from '../../components/DataTable';
import PrepWorkflowsTreeTable from '../../components/PrepWorkflowsTreeTable';
import Pager from '../../components/Pager';
import SubmissionModal from '../../components/SubmissionModal';

const DEFAULT_PAGE_SIZE = 10;
const PATH = '/tasks';

const SPLITTING_MARKS = ['default', '2x', '3x', '10x', '20x', '50x', '100x', '200x', 'max'];

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

const ORDER_BY_OPTIONS = [
    {value: 'priority-asc', label: 'Priority +'},
    {value: 'priority-desc', label: 'Priority -'},
    {value: 'prep-asc', label: 'Prep +'},
    {value: 'prep-desc', label: 'Prep -'},
    {value: 'updated-asc', label: 'Updated +'},
    {value: 'updated-desc', label: 'Updated -'},
];

const DEFAULT_ORDER = ORDER_BY_OPTIONS[1];

const Title = styled.h4`
    text-align: center;
    margin-bottom: 15px;
`;

const Details = styled.div`
    width: 100%;
    padding-bottom: 20px;
`;

const ActionAndSitesContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

const ActionFoldingContent = styled.div`
    display: flex;
    flex-direction: column;
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
    justify-content: flex-start;
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

const ActionTasks = styled.ul`
    padding-left: 15px;
    
    li {
        margin-bottom: 5px;
        list-style: circle;
    }
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

const ButtonsPanel = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
`;

const Inline = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const Div = styled.div`
    width: ${props => props.width || 'auto'}
    padding: ${props => props.padding || '0'}
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
        actions: PropTypes.shape({
            fetchTasks: PropTypes.func.isRequired,
            fetchSites: PropTypes.func.isRequired,
            fetchSitesStatus: PropTypes.func.isRequired,
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
            actions: [],
            selectedTasks: [],
            page: params.page || 1,
            filter: params.filter || '',
            orderBy: ORDER_BY_OPTIONS.find(opt => opt.value === params.orderBy) || DEFAULT_ORDER,
        };
    }

    componentDidMount() {
        this.props.actions.fetchSites();
        this.props.actions.fetchSitesStatus();
        this.fetchData();
    }

    fetchData = () => {
        const {page, filter, orderBy} = this.state;
        this.props.actions.fetchTasks(page, DEFAULT_PAGE_SIZE, filter, orderBy.value);
    };

    updateLocation = () => {
        const {page, filter, orderBy} = this.state;

        let params = getUrlParamsString({page, filter, orderBy: orderBy.value});

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

    reorder = (orderBy) => {
        this.setState({
            ...this.state,
            page: 1,
            orderBy,
        }, this.updateLocationAndFetchData);
    };

    onChangePage = (page) => {
        this.setState({
            ...this.state,
            page,
        }, this.updateLocationAndFetchData);
    };

    onActionDataChange = (idx, newValues) => {
        const {actions} = this.state;

        this.setState({
            ...this.state,
            actions: actions
                .map(action =>
                    action.idx === idx
                        ? {...action, ...newValues}
                        : action
                ),
        });
    };

    onSiteCheckboxClick = (action, task, siteName, checked) => {
        action.tasks.forEach( t => {
            if ( t.name == task.name ) {
                checked
                    ? t.selected_sites.add(siteName)
                    : t.selected_sites.delete(siteName);
            }
        });
    };

    renderSites = (action,task) => {
        const {sites: allSites} = this.props;
        const {sitesStatus} = this.props;

        return (
            <Sites>
                <Label>Choose sites:</Label>
                <SitesList>
                    {allSites.data.map(site => {
                        const checkboxId = `${task.name}_${site.name}`;

                        let siteInfo =
                            sitesStatus.data.find(
                                info => info.VOName == site.name
                            );

                        let status = siteInfo ? siteInfo.Status : ("NoInfo");

                        return (
                            <SiteField key={checkboxId}>
                                <CheckboxField
                                    label={<SiteLabel>{site.name} [{status.toUpperCase()}]</SiteLabel>}
                            checked={task.selected_sites.has(site.name)}
                                    handleChange={newValue => this.onSiteCheckboxClick(action, task, site.name, newValue)}
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
                    <SliderField marks={SPLITTING_MARKS} max={SPLITTING_MARKS.length - 1} step={null} included={false}
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

    renderActionForm = (idx, action) => {
        return (
            <ActionParameters>
                <ActionBlock>
                    <FormField>
                        <Label>Choose an action:</Label>
                        <SelectField
                            value={action.name}
                            onChange={action => this.onActionDataChange(idx, {'name': action})}
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
        return (
            <ReasonsForm>
                {action.reasons.map((reason, reasonIdx) =>
                    <ReasonItem key={`reason_${reasonIdx}`}>
                        <TextInput value={reason}
                                   onChange={e => this.onReasonChange(actionIdx, action, reasonIdx, e.target.value)}/>
                        <Button onClick={() => this.removeReason(actionIdx, action, reasonIdx)}
                                title={'Remove reason'}/>
                    </ReasonItem>
                )}
            </ReasonsForm>
        );
    };

    addAction = () => {
        const {actions} = this.state;
        const idx = new Date().getUTCMilliseconds();

        this.setState({
            ...this.state,
            actions: [
                ...actions,
                {
                    idx,
                    reasons: [],
                },
            ],
        });
    };

    removeAction = (idx) => {
        const {actions} = this.state;

        this.setState({
            ...this.state,
            actions: actions.filter(action => action.idx !== idx),
        });
    };

    applyActionToSelectedTasks = (action) => {
        let {selectedTasks} = this.state;

        selectedTasks.forEach( task => {
            let siteList = new Set();
            task.statuses.forEach(siteStatus => {
                siteList.add(siteStatus.site);
            });
            task.selected_sites = siteList;
        });

        this.onActionDataChange(action.idx, {'tasks': selectedTasks});
    };

    renderAction = (action, idx) => {
        return (
            <ActionFoldingContent>
                <ActionAndSitesContainer key={idx}>
                    {this.renderActionForm(idx, action)}
                </ActionAndSitesContainer>

                <div>
                    <Label>Applied to tasks:</Label>
                    {action.tasks && action.tasks.length > 0
                     ? <ActionTasks> {action.tasks.map(
                             (task, idx) => { 
                                 return (
                                         <div key={task.name}>
                                         <li key={idx}>{task.name}</li>
                                         {this.shouldShowSites(action) && this.renderSites(action,task)}
                                         </div>
                                 )
                             }
                     )}
                     </ActionTasks>
                        : <ul>
                            <li>No tasks added, select tasks and click 'Apply to selected tasks' button</li>
                        </ul>}
                </div>

                {action.reasons && this.renderActionReasons(idx, action)}

                <ButtonsPanel>
                    <Button onClick={() => this.addReason(idx, action)} title={'Add reason'}/>
                    <Button onClick={() => this.applyActionToSelectedTasks(action)} title={'Apply to selected tasks'}/>
                    <Button onClick={() => this.removeAction(idx)} title={'Remove action'}/>
                </ButtonsPanel>
            </ActionFoldingContent>
        )
    };

    renderActions = () => {
        const {actions} = this.state;

        return (
            <div>
                <DataTable
                    title={'Actions'}
                    data={actions}
                    columns={[{key: 'name.label', title: '', flex: 1, defaultValue: 'New action'}]}
                    folding={true}
                    idColumn={'idx'}
                    foldedContentRenderer={this.renderAction}
                />
                <ButtonsPanel>
                    <Button onClick={this.addAction} title={'Add action'}/>
                    <Button onClick={this.submitActions}
                            title={'Submit actions'}
                            disabled={ actions.length > 0 ? false : true }/>
                </ButtonsPanel>
            </div>
        )
    };

    formatTaskActionForUnified = (action) => {

        const method = _.get(action, 'method.value') || 'auto';

        return action.tasks.map(task => {
            return {
                name: task.name,
                workflow: task.workflow.name,
                parameters: {
                    action: _.get(action, 'name.value'),
                    xrootd: action.xrootd ? 'enabled' : 'disabled',
                    secondary: action.secondary ? 'enabled' : 'disabled',
                    splitting: action.splitting,
                    cores: action.cores,
                    memory: action.memory,
                    group: action.group,
                    sites: method === 'manual' ? task.selected_sites : [],
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

        const unifiedActions = actions
            .filter(this.shouldAddTaskAction)
            .flatMap(action => this.formatTaskActionForUnified(action));

        this.props.actions.saveTasksActions(unifiedActions);
    };

    onTasksSelectionChange = (selectedTasks) => {
        this.setState({
            ...this.state,
            selectedTasks,
        });
    };

    renderOrderByField = () => {
        const {orderBy} = this.state;
        return (
            <Inline>
                <span>Sort by:</span>
                <Div width={'200px'}>
                    <SelectField
                        value={orderBy}
                        onChange={orderBy => this.reorder(orderBy)}
                        options={ORDER_BY_OPTIONS}/>
                </Div>
            </Inline>
        )
    };

    render() {
        const {tasks, sites, sitesStatus, takeAction} = this.props;
        const {filter} = this.state;

        return (
            <div className="protected">
                {
                <SubmissionModal showModal={takeAction.isPosting || takeAction.showModal}
                                 msg={takeAction.msgModal}
                                 onChangeVisibility={this.props.actions.flipModalVisibility} />
                }
                <div className="container">

                    {this.renderActions()}

                    <Title>Tasks</Title>

                    {tasks.isFetching || sites.isFetching
                       || !tasks.data || sitesStatus.isFetching
                        ? <p className="text-center">Loading data...</p>
                        : <Details>
                            <PrepWorkflowsTreeTable
                                data={tasks.data.results}
                                onSelectionChangeFn={this.onTasksSelectionChange}
                                panelRenderer={() =>
                                    <Inline>
                                        <Filter onFilter={this.filter} initialValue={filter}/>
                                        {this.renderOrderByField()}
                                    </Inline>
                                }
                            />
                            <Pager data={tasks.data} onChangePage={this.onChangePage}/>
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
        sitesStatus: {
            data: state.sitesStatus.data,
            isFetching: state.sitesStatus.isFetching
        },
        takeAction: {
            data: state.takeAction.data,
            isPosting: state.takeAction.isPosting,
            msgModal: state.takeAction.msgModal,
            showModal: state.takeAction.showModal,
        }
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actionCreators, dispatch)
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TasksView));
export {TasksView as PrepsViewNotConnected};
