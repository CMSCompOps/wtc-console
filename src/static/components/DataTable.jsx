import React from 'react';
import PropTypes from 'prop-types';
import getListDataType from '../types/ListData';
import styled from 'styled-components';

const PagerWrapper = styled.div`
    width: 100%;
`;

const Pages = styled.ul`
    
`;

export default class DataTable extends React.Component {
    static propTypes = {
        data: getListDataType(PropTypes.any).isRequired,
        columns: PropTypes.arrayOf(PropTypes.string).isRequired,
        onChangePage: PropTypes.func
    };

    getPages(pageCount) {
        let pages = [];
        for (let i = 1; i <= pageCount; i++) {
            pages.push(i);
        }
        return pages;
    }

    renderPager = () => {
        const {changePage, data} = this.props;

        return (
            <PagerWrapper>
                <Pages>
                    {this.getPages(data.pages).map((page) =>
                        <li><a onClick={changePage(page)}>page</a></li>
                    )}
                </Pages>
            </PagerWrapper>
        )
    };

    render() {
        return (
            this.renderPager()
        );
    }
}