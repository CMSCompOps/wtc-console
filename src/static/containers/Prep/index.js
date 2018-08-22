import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {withRouter} from 'react-router';

import PrepDetailsType from '../../types/PrepDetails';
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

class PrepView extends React.Component {

    static propTypes = {
        isFetching: PropTypes.bool.isRequired,
        data: PrepDetailsType,
        token: PropTypes.string.isRequired,
        actions: PropTypes.shape({
            fetchPrep: PropTypes.func.isRequired,
        }).isRequired,
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    };

    static defaultProps = {
        data: null,
    };

    constructor(props) {
        super(props);

        this.state = {
            sortedBy: null,
            desc: false,
        };
    }

    componentWillMount() {
        const {token, match} = this.props;
        this.props.actions.fetchPrep(token, match.params.id);
    }

    sortData = (key, desc) => {
        this.setState({
            ...this.state,
            sortedBy: key,
            desc: desc,
        });
    };

    getSortedWorkflows = () => {
        const {data} = this.props;
        const {sortedBy, desc} = this.state;

        return sortItems(data.workflows, sortedBy, desc);
    };

    goToWorkflowDetails = (id) => {
        this.props.history.push(`/workflows/${id}`);
    };

    render() {
        const {isFetching, data} = this.props;
        const {sortedBy, desc} = this.state;

        return (
            <div className="protected">
                <div className="container">
                    <NavHeader title={'Prep'}/>
                    {isFetching || !data
                        ? <p className="text-center">Loading data...</p>
                        : <Details>
                            <Fields>
                                <Field>
                                    <Title>Name:</Title>
                                    <Value>{data.name}</Value>
                                </Field>
                                <Field>
                                    <Title>Campaign:</Title>
                                    <Value>{data.campaign}</Value>
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
                                data={this.getSortedWorkflows()}
                                title={'Workflows'}
                                columns={[
                                    {key: 'name', title: 'Workflow', flex: 1},
                                    {key: 'tasks_count', title: 'Cnt', width: '50px'},
                                    {key: 'created', title: 'Created', width: '150px', transformFn: getReadableTimestamp},
                                    {key: 'updated', title: 'Updated', width: '150px', transformFn: getReadableTimestamp},
                                ]}
                                onChangePage={this.onChangePage}
                                idColumn={'name'}
                                onClickFn={this.goToWorkflowDetails}
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
        data: state.prep.data,
        isFetching: state.prep.isFetching
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actionCreators, dispatch)
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PrepView));
export {PrepView as PrepViewNotConnected};
