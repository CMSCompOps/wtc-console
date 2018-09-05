import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
    margin: 10px 0 0 10px;
`;

export default function Button(props) {
    return <StyledButton classNames={'btn btn-default'} onClick={props.onClick}>{props.title}</StyledButton>;
}