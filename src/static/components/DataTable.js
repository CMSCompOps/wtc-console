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
    flex-direction: column;
`;

const RowHeader = styled.div`
    display: flex;
    flex-direction: row;
    background: #efefef;
    cursor: ${props => props.isLink ? 'pointer' : 'auto'};

    &:hover {
        background: #e8e8e8;
    }
`;

const Cell = styled.div`
    flex: ${props => `${props.flex || 0} ${props.width || ''}`}
    font-size: 14px;
    line-height: 16px;
    padding: 7px;
    border: 1px solid #ffffff;
    word-break: break-all;
    text-align: ${props => props.align || 'left'}
    overflow: hidden;
`;

const FoldingContent = styled.div`
    flex: 0 100%
    font-size: 14px;
    padding: 12px 10px 20px;
    border: 1px solid #ffffff;
    background: #fcfcfc;
`;

const SortIcon = styled.i`
    font-size: 10px;
    padding-left: 3px;
`;

const FoldIconContainer = styled.div`
    display: inline-block;
    float: left;
    height: 100%;
`;

const FoldIcon = styled.i`
    font-size: 15px;
    padding-right: 5px;
    cursor: pointer;
`;

export default class DataTable extends React.Component {
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
        })).isRequired,
        folding: PropTypes.bool,
        foldedContentRenderer: PropTypes.func,
        expandedIds: PropTypes.arrayOf(PropTypes.string),
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
        )
    };

    renderRow = (row, idx) => {
        const {
            columns,
            idColumn,
            onClickFn,
            folding,
            expandedIds,
            foldedContentRenderer,
        } = this.props;
        const id = _.get(row, idColumn);
        const expanded = folding && expandedIds && expandedIds.includes(id);

        return (
            <Row key={`row_${idx}`} >
                <RowHeader isLink={!!onClickFn} onClick={() => !!onClickFn && onClickFn(id)}>
                    {columns.map((col, col_idx) =>
                        <Cell
                            key={`cell_${idx}_${col.key}`}
                            flex={col.flex}
                            width={col.width}
                            align={col.align}
                        >
                            {folding && col_idx === 0 && <FoldIconContainer>
                                {expanded
                                    ? <FoldIcon className={'fa fa-minus-square-o'}/>
                                    : <FoldIcon className={'fa fa-plus-square-o'}/>}
                            </FoldIconContainer>}
                            {this.getCellValue(col, row)}
                        </Cell>
                    )}
                </RowHeader>
                {expanded && <FoldingContent>
                    {foldedContentRenderer(row, id)}
                </FoldingContent>}
            </Row>
        );
    };

    render() {
        const {
            data,
            title,
        } = this.props;

        return (
            <Wrapper>
                {title && <Title>{title}</Title>}
                <Table>
                    {this.renderHeader()}
                    {data.length > 0
                        ? data.map(this.renderRow)
                        : <Row><Cell align={'center'} flex={1}>No items</Cell></Row>
                    }
                </Table>
            </Wrapper>
        );
    }
}
