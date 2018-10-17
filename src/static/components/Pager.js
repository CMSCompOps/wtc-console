import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import getListDataType from '../types/ListData';
import {getPages} from '../utils/pages';


const Wrapper = styled.div`
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

export default class Pager extends React.Component {
    static propTypes = {
        data: getListDataType(PropTypes.any).isRequired,
        onChangePage: PropTypes.func,
    };


    render = () => {
        const {onChangePage, data} = this.props;

        return (
            <Wrapper>
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
            </Wrapper>
        )
    };
}
