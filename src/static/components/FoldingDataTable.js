import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DataTable from './DataTable';


export default class FoldingDataTable extends React.Component {
    static propTypes = {
        data: PropTypes.array.isRequired,
        columns: PropTypes.arrayOf(PropTypes.shape({
            key: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            width: PropTypes.string,
            transformFn: PropTypes.func,
        })).isRequired,
        title: PropTypes.string,
        detailsTemplate: PropTypes.func.isRequired,
        idColumn: PropTypes.string,
        sortFn: PropTypes.func,
        sortedBy: PropTypes.string,
        desc: PropTypes.bool,
    };

    expandItem = () => {

    };

    render () {
        return (
            <DataTable {...this.props} onClickFn={this.expandItem}/>
        )
    }
}