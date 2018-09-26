import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components';
import CheckboxField from './fields/CheckboxField';

const Wrapper = styled.div`
    width: 100%;
`;

const Title = styled.h4`
    text-align: center;
    margin-bottom: 15px;
`;

const Panel = styled.div`
    display: inline-block;
`;

const LeftPanel = styled(Panel)`
    float: left;

    * {
        margin-right: 5px;
    }
`;

const RightPanel = styled(Panel)`
    float: right;

    & > * {
        margin-left: 5px;
    }
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
    border: 1px solid #ccc;
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
    display: flex;
    flex: ${props => `${props.flex || 0} ${props.width || ''}`}
    font-size: 14px;
    line-height: 16px;
    padding: 7px;
    border: 1px solid #ccc;
    word-break: break-all;
    text-align: ${props => props.align || 'left'}
    overflow: hidden;
`;

const FoldingContent = styled.div`
    flex: 0 100%
    font-size: 14px;
    padding: 12px 10px 20px;
    border: 1px solid #ccc;
    // background: #f6f6f6;
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

const RowCheckbox = styled(CheckboxField)`
    display: inline-block;
    height: 100%;
    float: left;
    margin-right: 5px;
    
    input {
        margin: 0;
    }
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
            defaultValue: PropTypes.string,
        })).isRequired,
        folding: PropTypes.bool,
        foldedContentRenderer: PropTypes.func,
        expandedIds: PropTypes.arrayOf(PropTypes.string),
        selectable: PropTypes.bool,
        onSelectionChangeFn: PropTypes.func,
        idColumn: PropTypes.string,
        onClickFn: PropTypes.func,
        sortFn: PropTypes.func,
        sortedBy: PropTypes.string,
        desc: PropTypes.bool,
        panelRenderer: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            expandedRows: [],
            selectedRows: [],
        };
    }

    getId = (row) => {
        const { idColumn } = this.props;
        return _.get(row, idColumn);
    };

    getCellValue = (col, row) => {
        const val = _.get(row, col.key) || col.defaultValue;

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

    onRowClick = (id, row) => {
        const {folding, onClickFn} = this.props;

        folding && this.toggleRow(id);

        !!onClickFn && onClickFn(id, row);
    };

    toggleRow = (id) => {
        const {expandedRows} = this.state;

        this.setState({
            ...this.state,
            expandedRows: expandedRows.includes(id)
                ? expandedRows.filter(elem => elem !== id)
                : [...expandedRows, id],
        })
    };

    afterSelectionUpdate = () => {
        const {onSelectionChangeFn} = this.props;
        onSelectionChangeFn && onSelectionChangeFn(this.state.selectedRows);
    };

    toggleSelection = (row, selected) => {
        const {selectedRows} = this.state;
        const id = this.getId(row);

        this.setState({
            ...this.state,
            selectedRows: selected
                ? [...selectedRows, row]
                : selectedRows.filter(elem => this.getId(elem) !== id),
        }, this.afterSelectionUpdate);
    };

    selectAll = (event) => {
        event.preventDefault();

        const { data } = this.props;

        this.setState({
            ...this.state,
            selectedRows: data,
        }, this.afterSelectionUpdate);
    };

    clearAll = (event) => {
        event.preventDefault();

        this.setState({
            ...this.state,
            selectedRows: [],
        }, this.afterSelectionUpdate);
    };

    isSelected = (idx) => {
        const {selectedRows} = this.state;
        return !!selectedRows.find(elem => this.getId(elem) === idx);
    };

    renderRow = (row, idx) => {
        const {
            columns,
            onClickFn,
            folding,
            foldedContentRenderer,
            selectable,
        } = this.props;

        const id = this.getId(row);
        const expanded = folding && this.state.expandedRows.includes(id);

        return (
            <Row key={`row_${idx}`}>
                <RowHeader isLink={!!onClickFn || folding} onClick={() => this.onRowClick(id, row)}>
                    {columns.map((col, col_idx) =>
                        <Cell
                            key={`cell_${idx}_${col.key}`}
                            flex={col.flex}
                            width={col.width}
                            align={col.align}
                        >
                            {selectable && col_idx === 0 && <RowCheckbox
                                checked={this.isSelected(id)}
                                handleChange={checked => this.toggleSelection(row, checked)}
                            />}

                            {folding && col_idx === 0 && <FoldIconContainer>
                                {expanded
                                    ? <FoldIcon className={'fa fa-minus-square-o'}/>
                                    : <FoldIcon className={'fa fa-plus-square-o'}/>}
                            </FoldIconContainer>}

                            <div>{this.getCellValue(col, row)}</div>
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
            panelRenderer,
            selectable,
        } = this.props;

        return (
            <Wrapper>
                {title && <Title>{title}</Title>}
                <LeftPanel>
                    {panelRenderer && panelRenderer()}
                </LeftPanel>
                <RightPanel>
                    {selectable && <a href="#" onClick={this.selectAll}>Select all</a>}
                    {selectable && <a href="#" onClick={this.clearAll}>Clear all</a>}
                </RightPanel>
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
