import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import qs from 'query-string';

import * as actionCreators from '../../actions/data';
import getListDataType from '../../types/ListData';
import PrepType from '../../types/Prep';
import PagedDataTable from '../../components/PagedDataTable';
import {getReadableTimestamp} from '../../utils/dates';
import {getUrlParamsString} from '../../utils/url';
import Filter from '../../components/Filter';


const DEFAULT_PAGE_SIZE = 20;
const PATH = '/preps';

class PrepsView extends React.Component {

    static propTypes = {
        isFetching: PropTypes.bool.isRequired,
        data: getListDataType(PrepType),
        token: PropTypes.string.isRequired,
        actions: PropTypes.shape({
            fetchPreps: PropTypes.func.isRequired,
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
        this.props.actions.fetchPreps(token, page, DEFAULT_PAGE_SIZE, filter, sortedBy, desc);
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

    goToDetails = (id) => {
        this.props.history.push(`/preps/${id}`);
    };

    render() {
        const {isFetching, data} = this.props;
        const {filter, sortedBy, desc} = this.state;

        return (
            <div className="protected">
                <div className="container">
                    <h1 className="text-center margin-bottom-medium">Preps</h1>

                    <Filter onFilter={this.filter} initialValue={filter}/>

                    {isFetching || !data
                        ? <p className="text-center">Loading data...</p>
                        : <PagedDataTable
                            data={data}
                            columns={[
                                {key: 'name', title: 'Prep', flex: 1},
                                {key: 'campaign', title: 'Campaign', flex: 1},
                                {key: 'priority', title: 'Priority', width: '100px', align: 'right'},
                                {key: 'workflows__count', title: 'Cnt', width: '55px', align: 'right'},
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
        data: state.preps.data,
        isFetching: state.preps.isFetching
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actionCreators, dispatch)
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PrepsView));
export {PrepsView as PrepsViewNotConnected};
