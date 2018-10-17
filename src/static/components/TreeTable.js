import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CheckboxField from './fields/CheckboxField';
import {createTree, insert} from '../utils/tree';

const DATA = [
    {
        id: 'SUS-RunIIFall17DRPremix-00110',
        workflows: [
            {
                name: 'workflow_main',
                tasks: [
                    {id: 'SUS-RunIIFall17MiniAODv2-00105_0'},
                    {id: 'SUS-RunIIFall17MiniAODv2-00045_0MergeMINIAODSIMoutput'},
                    {id: 'SUS-RunIIFall17NanoAOD-00065_0MergeNANOEDMAODSIMoutput'},
                ]
            },
            {
                name: 'workflow_acdc_1',
                parent_workflow: 'workflow_main',
                tasks: [
                    {id: 'SUS-RunIIFall17NanoAOD-00065_0MergeNANOEDMAODSIMoutput'},
                ]
            },
            {
                name: 'workflow_acdc_1',
                parent_workflow: 'workflow_main',
                tasks: [
                    {id: 'SUS-RunIIFall17NanoAOD-00065_0MergeNANOEDMAODSIMoutput'},
                    {id: 'SUS-RunIIFall17MiniAODv2-00045_0MergeMINIAODSIMoutput'},
                ]
            },
            {
                name: 'workflow_acdc_11',
                parent_workflow: 'workflow_acdc_1',
                tasks: [
                    {id: 'SUS-RunIIFall17NanoAOD-00065_0MergeNANOEDMAODSIMoutput'},
                    {id: 'SUS-RunIIFall17MiniAODv2-00045_0MergeMINIAODSIMoutput'},
                ]
            },
            {
                name: 'workflow_acdc_12',
                parent_workflow: 'workflow_acdc_1',
                tasks: [
                    {id: 'SUS-RunIIFall17NanoAOD-00065_0MergeNANOEDMAODSIMoutput'},
                    {id: 'SUS-RunIIFall17MiniAODv2-00045_0MergeMINIAODSIMoutput'},
                ]
            },
        ]
    },
    {
        id: 'SUS-RunIIFall17DRPremix-00110',
        workflows: [
            {
                name: 'workflow_main',
                tasks: [
                    {id: 'SUS-RunIIFall17MiniAODv2-00105_0'},
                    {id: 'SUS-RunIIFall17MiniAODv2-00045_0MergeMINIAODSIMoutput'},
                    {id: 'SUS-RunIIFall17NanoAOD-00065_0MergeNANOEDMAODSIMoutput'},
                ]
            },
        ]
    },
];

const WORKFLOW_CELL_WIDTH = 200;

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
    background: #efefef;
`;

const Col = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
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

const Checkbox = styled(CheckboxField)`
    margin-right: 5px;
`;

export default class TreeTable extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        data: PropTypes.array.isRequired,
        columns: PropTypes.arrayOf(PropTypes.shape({
            key: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            flex: PropTypes.number,
            width: PropTypes.string,
            transformFn: PropTypes.func,
            align: PropTypes.string,
            defaultValue: PropTypes.string,
        })).isRequired,
        foldedContentRenderer: PropTypes.func,
        selectable: PropTypes.bool,
        onSelectionChangeFn: PropTypes.func,
        idColumn: PropTypes.string,
        panelRenderer: PropTypes.func,
    };

    renderTask = (task) => {
        return (
            <Row>
                <Cell flex={1}><Value><Checkbox/>{task.id}</Value></Cell>
                <Cell width={200}><Value>{task.failures_count}</Value></Cell>
            </Row>
        )
    };

    renderWorkflow = (workflow, level) => {
        const padding = level * 20;

        return (
            <Col>
                <Row>
                    <Indent width={padding}/>
                    <Cell width={WORKFLOW_CELL_WIDTH - padding}><Value><Checkbox/>{workflow.id}</Value></Cell>
                    {/*<Cell flex={1}>Tasks cell</Cell>*/}
                    <Cell flex={1}>{workflow.tasks.map(this.renderTask)}</Cell>
                </Row>

                {workflow.children.map(child => this.renderWorkflow(child, level + 1))}
            </Col>
        )
    };

    renderPrep = (prep) => {
        const workflows = prep.workflows.map(w => {
            return {...w, id: w.name, parent: w.parent_workflow, children: []}
        });
        const workflowsTree = createTree(workflows);

        console.log('workflows', workflows);
        console.log('workflows tree', workflowsTree);

        return (
            <Row>
                <Cell width={150}><Value><Checkbox/>{prep.id}</Value></Cell>
                <Cell flex={1}>{workflowsTree.map(w => this.renderWorkflow(w, 0))}</Cell>
            </Row>
        )
    };

    render() {
        return (
            <Table>
                <Rows>
                    {DATA.map(this.renderPrep)}
                </Rows>
            </Table>
        )
    }
}
