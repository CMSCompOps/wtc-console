import React from 'react';
import styled from 'styled-components';
import Slider from 'rc-slider';

const Wrapper = styled.div`
    width: 100%;
    padding: 0 8px 15px;
`;

export default class StyledField extends React.Component {

    getMarks = () => {
        const {marks} = this.props;

        return Array.isArray(marks)
            ? Object.assign({}, marks)
            : marks;
    };

    onChange = (val) => {
        const {marks, onChange} = this.props;

        if (onChange) {
            if (Array.isArray(marks)) {
                onChange(this.getMarks()[val]);
            } else {
                onChange(val);
            }
        }
    };

    render() {
        return (
            <Wrapper>
                <Slider {...this.props} marks={this.getMarks()} onChange={this.onChange}/>
            </Wrapper>
        );
    }
}