import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CheckboxField from './fields/CheckboxField';

const WORKFLOW_CELL_WIDTH = 320;

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
        title: PropTypes.string,
        data: PropTypes.array.isRequired,
    };

    renderTask = (task, fill) => {
        return (
            <Row fill={fill} key={task.name}>
                <Cell flex={1}><Value><Checkbox/>{task.name}</Value></Cell>
                <Cell width={200}><Value>{task.failures_count}</Value></Cell>
            </Row>
        )
    };

    renderWorkflow = (workflow, level, fill) => {
        const padding = level * 20;
        const fillWorkflow = !workflow.children || workflow.children.length === 0;
        const fillTask = workflow.tasks && workflow.tasks.length === 1;

        return (
            <Col fill={fill} key={workflow.id}>
                <Row fill={fillWorkflow}>
                    <Indent width={padding}/>
                    <Cell width={WORKFLOW_CELL_WIDTH - padding}><Value><Checkbox/>{workflow.id}</Value></Cell>
                    <Cell flex={1}>{workflow.tasks.map(task => this.renderTask(task, fillTask))}</Cell>
                </Row>

                {!!workflow.children && workflow.children.map(child => this.renderWorkflow(child, level + 1))}
            </Col>
        )
    };

    renderPrep = (prep) => {
        const fill = prep.workflows.length === 1;
        if (fill) console.log('prep', prep);
        return (
            <Row key={prep.name}>
                <Cell width={300}>
                    <Value>
                        <Checkbox/>
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
        } = this.props;

        return (
            <Table>
                <Rows>
                    {data.length > 0
                        ? data.map(this.renderPrep)
                        : <Row><Cell align={'center'} flex={1}>No items</Cell></Row>
                    }
                </Rows>
            </Table>
        )
    }
}
