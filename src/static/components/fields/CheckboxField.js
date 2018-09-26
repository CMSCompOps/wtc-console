import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';


const Wrapper = styled.div`
    cursor: pointer;
`;

const StyledCheckbox = styled.input`
    margin: 0;
    cursor: pointer;
`;

export default class CheckboxField extends React.Component {

    static propTypes = {
        checked: PropTypes.bool,
        label: PropTypes.any,
        handleChange: PropTypes.func,
        className: PropTypes.string,
    };

    toggleValue = (e) => {
        const {handleChange, checked} = this.props;
        handleChange(!checked);
        e.stopPropagation();
    };

    render() {
        const {checked, className, label} = this.props;

        return (
            <Wrapper className={className} onClick={this.toggleValue}>
                <StyledCheckbox type={'checkbox'} checked={checked}/>
                {label}
            </Wrapper>
        )
    }
}