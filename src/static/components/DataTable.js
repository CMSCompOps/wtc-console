import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components';

const Table = styled.table`
    width: 100%;
`;

const HeaderRow = styled.tr`
    background: #e7e7e7;
`;

const HeaderCell = styled.th`
    font-size: 14px;
    font-weight: bold;
    padding: 7px;
    border: 1px solid white;
    width: ${props => props.width || 'auto'};
    vertical-align: middle;
    cursor: ${props => props.isLink ? 'pointer' : 'auto'};
`;

const Row = styled.tr`
    background: #c6e3df;
    cursor: ${props => props.isLink ? 'pointer' : 'auto'};
    height: 20px;

    &:hover {
        background: #f8f8f8;
    }
`;

const Cell = styled.td`
    font-size: 14px;
    padding: 7px;
    border: 1px solid white;
    word-break: break-all;
    vertical-align: middle;
    text-align ${props => props.align || 'left'}
`;

const SortIcon = styled.i`
    font-size: 10px;
    padding-left: 3px;
`;

export default class DataTable extends React.Component {
    static propTypes = {
        data: PropTypes.array.isRequired,
        columns: PropTypes.arrayOf(PropTypes.shape({
            key: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            width: PropTypes.string,
            transformFn: PropTypes.func,
        })).isRequired,
        idColumn: PropTypes.string,
        onClickFn: PropTypes.func,
        sortFn: PropTypes.func,
        sortedBy: PropTypes.string,
        desc: PropTypes.bool,
    };

    getCellValue = (col, row) => {
        const val = _.get(row, col.key);

        return col.transformFn
            ? col.transformFn(val)
            : val;
    };

    renderSortIcon = (desc) => {
        return (
            desc
                ? <SortIcon className="fa fa-chevron-down"/>
                : <SortIcon className="fa fa-chevron-up"/>
        )
    };

    renderHeader = () => {
        const {columns, sortFn, sortedBy, desc} = this.props;

        return (
            <thead>
            <HeaderRow>
                {columns.map((col, idx) =>
                    <HeaderCell
                        key={idx}
                        width={col.width}
                        isLink={!!sortFn}
                        onClick={() => !!sortFn && sortFn(col.key, !desc)}
                    >
                        {col.title}
                        {sortedBy === col.key && this.renderSortIcon(desc)}
                    </HeaderCell>
                )}
            </HeaderRow>
            </thead>
        )
    };

    render() {
        const {columns, data, idColumn, onClickFn} = this.props;

        return (
            <Table>
                {this.renderHeader()}
                <tbody>
                {data.length > 0
                    ? data.map((row, idx) =>
                        <Row
                            key={`row_${idx}`}
                            isLink={!!onClickFn}
                            onClick={() => !!onClickFn && onClickFn(_.get(row, idColumn))}
                        >
                            {columns.map(col =>
                                <Cell key={`cell_${idx}_${col.key}`}>{this.getCellValue(col, row)}</Cell>
                            )}
                        </Row>
                    )
                    : <Row><Cell align={'center'} colSpan={columns.length}>No items</Cell></Row>
                }
                </tbody>
            </Table>
        );
    }
}
