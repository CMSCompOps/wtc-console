import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';


const FilterWrapper = styled.form`
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

export default class Filter extends React.Component {

    static propTypes = {
        onFilter: PropTypes.func.isRequired,
        initialValue: PropTypes.string,
    };

    static defaultProps = {
        initialValue: '',
    };

    constructor(props) {
        super(props);

        this.state = {
            filter: props.initialValue || '',
        };
    }

    onSubmit = (event, value) => {
        const {onFilter} = this.props;

        event.preventDefault();

        if (!value) {
            this.setState({
                ...this.state,
                filter: '',
            });
        }

        onFilter(value);
    };

    render() {
        const {filter} = this.state;

        return (
            <FilterWrapper onSubmit={(e) => this.onSubmit(e, filter)} value={filter}>
                <Input
                    type={'search'}
                    value={filter}
                    onChange={e => this.setState({...this.state, filter: e.target.value})}/>
                <Button type={'submit'}>Search</Button>
                <Button onClick={(e) => this.onSubmit(e)}>Clear</Button>
            </FilterWrapper>
        );
    }
}
