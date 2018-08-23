import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {withRouter} from 'react-router';

import WorkflowType from '../../types/Workflow';
import * as actionCreators from '../../actions/data';
import {getReadableTimestamp} from '../../utils/dates';
import DataTable from '../../components/DataTable';
import NavHeader from '../../components/NavHeader';
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

const Sites = Section.extend`
    flex: 2;
`;

const Actions = Section.extend`
    flex: 1;
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
    };

    static defaultProps = {
        data: null,
    };

    constructor(props) {
        super(props);

        this.state = {
            expandedTasks: [],
            sortedBy: null,
            desc: false,
        };
    }

    componentWillMount() {
        const {token, match} = this.props;
        this.props.actions.fetchWorkflow(token, match.params.id);
    }

    sortData = (key, desc) => {
        this.setState({
            ...this.state,
            sortedBy: key,
            desc: desc,
        });
    };

    getSortedTasks = () => {
        const {data} = this.props;
        const {sortedBy, desc} = this.state;

        return sortItems(data.tasks, sortedBy, desc);
    };

    toggleRow = (id) => {
        const {expandedTasks} = this.state;

        this.setState({
            ...this.state,
            expandedTasks: expandedTasks.includes(id)
                ? expandedTasks.filter(elem => elem !== id)
                : [...expandedTasks, id],
        })
    };

    foldedContentRenderer = (row, id) => {
        return (
            <SitesAndActionsContainer>
                <Sites>
                    <SectionTitle>Sites</SectionTitle>
                    <DataTable
                        data={row.statuses}
                        columns={[
                            {key: 'site', title: 'Site', flex: 1},
                            {key: 'success_count', title: 'Completed', width: '110px'},
                            {key: 'failed_count', title: 'Failed', width: '110px'},
                        ]}
                    />
                </Sites>
                <Actions>
                    <SectionTitle>Actions</SectionTitle>
                    <div>Todo</div>
                </Actions>
            </SitesAndActionsContainer>
        )
    };

    render() {
        const {isFetching, data} = this.props;
        const {sortedBy, desc, expandedTasks} = this.state;

        return (
            <div className="protected">
                <div className="container">
                    <NavHeader title={'Workflow'}/>
                    {isFetching || !data
                        ? <p className="text-center">Loading data...</p>
                        : <Details>
                            <Fields>
                                <Field>
                                    <Title>Name:</Title>
                                    <Value>{data.name}</Value>
                                </Field>
                                {data.prep && <Field>
                                    <Title>Prep:</Title>
                                    <Value>{data.prep.name}</Value>
                                </Field>}
                                {data.prep && <Field>
                                    <Title>Campaign:</Title>
                                    <Value>{data.prep.campaign}</Value>
                                </Field>}
                                {data.prep && <Field>
                                    <Title>Priority:</Title>
                                    <Value>{data.prep.priority}</Value>
                                </Field>}
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
                                foldedContentRenderer={this.foldedContentRenderer}
                                expandedIds={expandedTasks}
                                idColumn={'name'}
                                onClickFn={this.toggleRow}
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
