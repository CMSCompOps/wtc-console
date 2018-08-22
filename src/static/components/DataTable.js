import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components';

const Wrapper = styled.div`
    width: 100%;
`;

const Title = styled.h4`
    text-align: center;
    margin-bottom: 15px;
`;

const Table = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const HeaderRow = styled.div`
    display: flex;
    flex-direction: row;
    background: #ddd;
`;

const HeaderCell = styled.div`
    flex: ${props => `${props.flex || 0} ${props.width || ''}`}
    font-size: 14px;
    font-weight: bold;
    padding: 7px;
    border: 1px solid white;
    cursor: ${props => props.isLink ? 'pointer' : 'auto'};
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    background: #efefef;
    cursor: ${props => props.isLink ? 'pointer' : 'auto'};

    &:hover {
        background: #fcfcfc;
    }
`;

const Cell = styled.div`
    flex: ${props => `${props.flex || 0} ${props.width || ''}`}
    flex-wrap: wrap;
    font-size: 14px;
    padding: 7px;
    border: 1px solid white;
    word-break: break-all;
    text-align ${props => props.align || 'left'}
    overflow: hidden;
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
            flex: PropTypes.number,
            width: PropTypes.string,
            transformFn: PropTypes.func,
        })).isRequired,
        title: PropTypes.string,
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
                        flex={col.flex}
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
        const {columns, data, idColumn, onClickFn, title} = this.props;

        return (
            <Wrapper>
                {title && <Title>{title}</Title>}
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
                                    <Cell
                                        key={`cell_${idx}_${col.key}`}
                                        flex={col.flex}
                                        width={col.width}
                                    >
                                        {this.getCellValue(col, row)}
                                        </Cell>
                                )}
                            </Row>
                        )
                        : <Row><Cell align={'center'} colSpan={columns.length}>No items</Cell></Row>
                    }
                    </tbody>
                </Table>
            </Wrapper>
        );
    }
}
