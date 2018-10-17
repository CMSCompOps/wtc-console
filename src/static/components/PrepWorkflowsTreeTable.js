import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CheckboxField from './fields/CheckboxField';
import {getReadableTimestamp} from '../utils/dates';

const WORKFLOW_CELL_WIDTH = 320;

const Wrapper = styled.div`
    width: 100%;
`;

const Panel = styled.div`
    display: inline-block;
`;

const LeftPanel = styled(Panel)`
    float: left;

    * {
        margin-right: 5px;
    }
`;

const RightPanel = styled(Panel)`
    float: right;

    & > * {
        margin-left: 5px;
    }
`;

const Table = styled.div`
    padding: 20px 0;
`;

const Rows = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: ${props => props.fill ? '100%' : 'auto'};
    background: #efefef;
`;

const Col = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: ${props => props.fill ? '100%' : 'auto'};
    background: #efefef;
`;

const Cell = styled.div`
    flex: ${props => `${props.flex || 0} ${props.width ? `${props.width}px` : ''}`}
    border: 1px solid #ccc;
`;

const Indent = styled.div`
    flex: ${props => `${props.flex || 0} ${props.width ? `${props.width}px` : ''}`}
`;

const Value = styled.div`
    display: flex;
    flex-direction: row;
    font-size: 14px;
    line-height: 16px;
    word-break: break-all;
    padding: 7px;
`;

const Wide = styled.div`
    width: 100%;
`;

const Left = styled.div`
    display: inline-block;
`;

const Right = styled.div`
    display: inline-block;
    float: right;
`;

const Checkbox = styled(CheckboxField)`
    margin-right: 5px;
`;

export default class PrepWorkflowsTreeTable extends React.Component {
    static propTypes = {
        data: PropTypes.array.isRequired,
        onSelectionChangeFn: PropTypes.func,
        panelRenderer: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            selectedTasks: [],
            selectedWorkflows: [],
        };
    }

    afterSelectionUpdate = () => {
        const {onSelectionChangeFn} = this.props;
        onSelectionChangeFn && onSelectionChangeFn(this.state.selectedTasks);
    };

    isWorkflowSelected = (workflowName) => {
        const {selectedWorkflows} = this.state;
        return !!selectedWorkflows.find(elem => elem.name === workflowName);
    };

    toggleWorkflowSelection = (workflows, selected) => {
        const {selectedWorkflows} = this.state;
        const names = workflows.map(task => task.name);

        this.setState({
            ...this.state,
            selectedWorkflows: selected
                ? [...selectedWorkflows, ...workflows]
                : selectedWorkflows.filter(elem => !names.includes(elem.name)),
        }, this.afterSelectionUpdate);
    };

    isTaskSelected = (taskName) => {
        const {selectedTasks} = this.state;
        return !!selectedTasks.find(elem => elem.name === taskName);
    };

    toggleTasksSelection = (tasks, selected) => {
        const {selectedTasks} = this.state;
        const names = tasks.map(task => task.name);

        console.log('tasks', selected, names);

        this.setState({
            ...this.state,
            selectedTasks: selected
                ? [...selectedTasks, ...tasks]
                : selectedTasks.filter(elem => !names.includes(elem.name)),
        }, this.afterSelectionUpdate);
    };

    getAllWorkflowTasks = (workflow) => {
        const childrenTasks = workflow.children
            ? workflow.children.flatMap(this.getAllWorkflowTasks)
            : [];

        return [
            ...workflow.tasks,
            ...childrenTasks,
        ]

    };

    flattenWorkflows = (workflow) => {
        return [
            ...workflow.children,
            workflow
        ]

    };

    getAllPrepTasks = (prep) => prep.workflows.flatMap(this.getAllWorkflowTasks);

    selectAll = (event) => {
        event.preventDefault();

        this.setState({
            ...this.state,
            selectedTasks: this.props.data.flatMap(this.getAllPrepTasks),
        }, this.afterSelectionUpdate);
    };

    clearAll = (event) => {
        event.preventDefault();

        this.setState({
            ...this.state,
            selectedTasks: [],
        }, this.afterSelectionUpdate);
    };

    renderTask = (task, fill) => {
        return (
            <Row fill={fill} key={task.name}>
                <Cell flex={1}>
                    <Value>
                        <Checkbox
                            checked={this.isTaskSelected(task.name)}
                            handleChange={checked => this.toggleTasksSelection([task], checked)}
                        />
                        {task.name}
                    </Value>
                </Cell>
                <Cell width={200}><Value>{task.failures_count}</Value></Cell>
            </Row>
        )
    };

    renderWorkflow = (workflow, level, fill) => {
        const padding = level * 20;
        const fillWorkflow = !workflow.children || workflow.children.length === 0;
        const fillTask = workflow.tasks && workflow.tasks.length === 1;

        return (
            <Col fill={fill} key={workflow.name}>
                <Row fill={fillWorkflow}>
                    <Indent width={padding}/>
                    <Cell width={WORKFLOW_CELL_WIDTH - padding}>
                        <Value>
                            <Checkbox
                                checked={this.isWorkflowSelected(workflow.name)}
                                handleChange={checked => {
                                    this.toggleWorkflowSelection(this.flattenWorkflows(workflow), checked);
                                    this.toggleTasksSelection(this.getAllWorkflowTasks(workflow), checked);
                                }}
                            />
                            {workflow.name}
                        </Value>
                    </Cell>
                    <Cell flex={1}>{workflow.tasks.map(task => this.renderTask(task, fillTask))}</Cell>
                </Row>

                {!!workflow.children && workflow.children.map(child => this.renderWorkflow(child, level + 1))}
            </Col>
        )
    };

    renderPrep = (prep) => {
        const fill = prep.workflows.length === 1;

        return (
            <Row key={prep.name}>
                <Cell width={300}>
                    <Value>
                        <Checkbox
                            handleChange={checked => this.toggleTasksSelection(this.getAllPrepTasks(prep), checked)}
                        />
                        <Wide>
                            <Wide>
                                <Left><strong>Prep:</strong></Left>
                                <Right>{prep.name}</Right>
                            </Wide>
                            <Wide>
                                <Left><strong>Campaign:</strong></Left>
                                <Right>{prep.campaign}</Right>
                            </Wide>
                            <Wide>
                                <Left><strong>Priority:</strong></Left>
                                <Right>{prep.priority}</Right>
                            </Wide>
                            <Wide>
                                <Left><strong>Updated:</strong></Left>
                                <Right>{getReadableTimestamp(prep.updated)}</Right>
                            </Wide>
                        </Wide>
                    </Value>
                </Cell>
                <Cell flex={1}>{prep.workflows.map(w => this.renderWorkflow(w, 0, fill))}</Cell>
            </Row>
        )
    };

    render() {
        const {
            data,
            panelRenderer,
        } = this.props;

        return (
            <Wrapper>
                <LeftPanel>
                    {panelRenderer && panelRenderer()}
                </LeftPanel>
                <RightPanel>
                    <a href="#" onClick={this.selectAll}>Select all</a>
                    <a href="#" onClick={this.clearAll}>Clear all</a>
                </RightPanel>
                <Table>
                    <Rows>
                        {data.length > 0
                            ? data.map(this.renderPrep)
                            : <Row><Cell align={'center'} flex={1}>No items</Cell></Row>
                        }
                    </Rows>
                </Table>
            </Wrapper>
        )
    }
}
