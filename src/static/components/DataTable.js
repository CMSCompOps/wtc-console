import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import getListDataType from '../types/ListData';
import styled from 'styled-components';
import {getPages} from '../utils/pages';

const Wrapper = styled.div`
    width: 100%;
`;

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
`;

const Row = styled.tr`
    background: #c6e3df;
    cursor: pointer;
    height: 20px;
    
    &:hover {
        background: #e7e7e7;
    }
`;

const Cell = styled.td`
    font-size: 14px;
    padding: 7px;
    border: 1px solid white;
    word-break: break-all;
    vertical-align: middle;
`;

const PagerWrapper = styled.div`
    width: 100%;
`;

const Pages = styled.ul`
    text-align: center;
    padding: 5px;
    
    li {
        display: inline-block;
        padding: 4px;
        font-size: 14px;
    }
    a {
        font-size: 14px;
        text-decoration: none;
    }
`;

export default class DataTable extends React.Component {
    static propTypes = {
        data: getListDataType(PropTypes.any).isRequired,
        columns: PropTypes.arrayOf(PropTypes.shape({
            key: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            width: PropTypes.string,
            transformFn: PropTypes.func,
        })).isRequired,
        onChangePage: PropTypes.func,
    };

    getCellValue = (col, row) => {
        const val = _.get(row, col.key);

        return col.transformFn
            ? col.transformFn(val)
            : val;
    };

    renderHeader = () => {
        const {columns} = this.props;

        return (
            <thead>
            <HeaderRow>
                {columns.map((col, idx) =>
                    <HeaderCell key={idx} width={col.width}>{col.title}</HeaderCell>
                )}
            </HeaderRow>
            </thead>
        )
    };

    renderTable = () => {
        const {columns, data} = this.props;

        return (
            <Table>
                {this.renderHeader()}
                <tbody>
                {data.results.map((row, idx) =>
                    <Row key={`row_${idx}`}>
                        {columns.map(col =>
                            <Cell key={`cell_${idx}_${col.key}`}>{this.getCellValue(col, row)}</Cell>
                        )}
                    </Row>
                )}
                </tbody>
            </Table>
        )
    };

    renderPager = () => {
        const {onChangePage, data} = this.props;

        return (
            <PagerWrapper>
                <Pages>
                    {getPages(data.pages).map((page, idx) =>
                        <li key={`page_${idx}`}>
                            {data.current === page
                                ? <strong>{page}</strong>
                                : <a onClick={() => onChangePage(page)}>{page}</a>
                            }
                        </li>
                    )}
                </Pages>
            </PagerWrapper>
        )
    };

    render() {
        return (
            <Wrapper>
                {this.renderTable()}
                {this.renderPager()}
            </Wrapper>
        );
    }
}