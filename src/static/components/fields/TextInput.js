import React from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
    width: 100%;
    padding: 10px;
    border-color: #ccc;
    border-radius: 4px;
    border-style: solid;
    border-width: 1px;
`;

export default function TextInput(props) {
    return <StyledInput classNames={'form-control'} type={'text'} {...props}/>
}