import React from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
    margin: 10px 0 0 10px;
`;

export default function TextInput(props) {
    return <StyledInput classNames={'form-control'} type={'text'} {...props}/>
}