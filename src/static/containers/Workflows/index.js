import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import styled from 'styled-components';
import qs from 'query-string';

import * as actionCreators from '../../actions/data';
import getListDataType from '../../types/ListData';
import WorkflowsType from '../../types/Workflows';
import PagedDataTable from '../../components/PagedDataTable';
import {getReadableTimestamp} from '../../utils/dates';
import {getUrlParamsString} from '../../utils/url';


const DEFAULT_PAGE_SIZE = 20;
const PATH = '/workflows';

const Filter = styled.form`
    width: 100%;
    padding-bottom: 10px;
`;

const Input = styled.input`
    display: inline-block;
    border: 1px solid #828282;
    font-size: 14px;
    padding: 3px 6px;
    height: 24px;
`;

const Button = styled.button`
    display: inline-block;
    border: 1px solid #828282;
    background-color: #e7e7e7;
    font-size: 14px;
    padding: 4px 5px;
    margin-left: 5px;
    height: 24px;
`;

class WorkflowsView extends React.Component {

    static propTypes = {
        isFetching: PropTypes.bool.isRequired,
        data: getListDataType(WorkflowsType),
        token: PropTypes.string.isRequired,
        actions: PropTypes.shape({
            fetchWorkflows: PropTypes.func.isRequired,
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
            page: params.page || 1,
            filter: params.filter || '',
            sortedBy: params.sortedBy,
            desc: !!params.desc,
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        const {token} = this.props;
        const {page, filter, sortedBy, desc} = this.state;
        this.props.actions.fetchWorkflows(token, page, DEFAULT_PAGE_SIZE, filter, sortedBy, desc);
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

    filter = (e) => {
        this.setState({
            ...this.state,
            page: 1,
        }, this.updateLocationAndFetchData);

        e.preventDefault();
    };

    clear = () => {
        this.setState({
            ...this.state,
            page: 1,
            filter: '',
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

    goToDetails = (id) => {
        this.props.history.push(`/workflows/${id}`);
    };

    render() {
        const {isFetching, data} = this.props;
        const {filter, sortedBy, desc} = this.state;

        return (
            <div className="protected">
                <div className="container">
                    <h1 className="text-center margin-bottom-medium">Workflows</h1>
                    <Filter onSubmit={this.filter}>
                        <Input
                            type={'search'}
                            value={filter}
                            onChange={e => this.setState({...this.state, filter: e.target.value})}/>
                        <Button type={'submit'}>Search</Button>
                        <Button onClick={this.clear}>Clear</Button>
                    </Filter>
                    {isFetching || !data
                        ? <p className="text-center">Loading data...</p>
                        : <PagedDataTable
                            data={data}
                            columns={[
                                {key: 'name', title: 'Workflow', width: '45%'},
                                {key: 'prep.name', title: 'Prep'},
                                {key: 'prep.campaign', title: 'Campaign'},
                                {
                                    key: 'updated',
                                    title: 'Last updated',
                                    width: '150px',
                                    transformFn: getReadableTimestamp
                                },
                            ]}
                            onChangePage={this.onChangePage}
                            idColumn={'name'}
                            onClickFn={this.goToDetails}
                            sortFn={this.sortData}
                            sortedBy={sortedBy}
                            desc={desc}
                        />
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.workflows.data,
        isFetching: state.workflows.isFetching
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actionCreators, dispatch)
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WorkflowsView));
export {WorkflowsView as WorkflowsViewNotConnected};
