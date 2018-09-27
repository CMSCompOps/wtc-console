import React from 'react';
import styled from 'styled-components';
import CheckboxField from './fields/CheckboxField';

const DATA = [
    {
        id: 'SUS-RunIIFall17DRPremix-00110',
        workflows: [
            {
                id: 'workflow_main',
                tasks: [
                    {id: 'SUS-RunIIFall17MiniAODv2-00105_0'},
                    {id: 'SUS-RunIIFall17MiniAODv2-00045_0MergeMINIAODSIMoutput'},
                    {id: 'SUS-RunIIFall17NanoAOD-00065_0MergeNANOEDMAODSIMoutput'},
                ]
            },
            {
                id: 'workflow_acdc_1',
                parent: 'workflow_main',
                tasks: [
                    {id: 'SUS-RunIIFall17NanoAOD-00065_0MergeNANOEDMAODSIMoutput'},
                ]
            },
            {
                id: 'workflow_acdc_1',
                parent: 'workflow_main',
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
                id: 'workflow_main',
                tasks: [
                    {id: 'SUS-RunIIFall17MiniAODv2-00105_0'},
                    {id: 'SUS-RunIIFall17MiniAODv2-00045_0MergeMINIAODSIMoutput'},
                    {id: 'SUS-RunIIFall17NanoAOD-00065_0MergeNANOEDMAODSIMoutput'},
                ]
            },
        ]
    },
];

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

const Cell = styled.div`
    flex: ${props => `${props.flex || 0} ${props.width || ''}`}
    border: 1px solid #ccc;
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

    renderTask = (task) => {
        return (
            <Row>
                <Cell flex={1}><Value><Checkbox/>{task.id}</Value></Cell>
                <Cell flex={1}><Value>Some more data</Value></Cell>
            </Row>
        )
    };

    renderWorkflow = (workflow) => {
        return (
            <Row>
                <Cell width={'200px'}><Value><Checkbox/>{workflow.id}</Value></Cell>
                <Cell flex={1}>{workflow.tasks.map(this.renderTask)}</Cell>
            </Row>
        )
    };

    renderPrep = (prep) => {
        return (
            <Row>
                <Cell width={'150px'}><Value><Checkbox/>{prep.id}</Value></Cell>
                <Cell flex={1}>{prep.workflows.map(this.renderWorkflow)}</Cell>
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
