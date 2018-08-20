import React from 'react';
import styled from 'styled-components';


const BackIcon = styled.i`
    position: absolute;
    display: block;
    float: left;
    font-size: 24px;
    padding: 12px;
    cursor: pointer;
`;

export default function BackButton(props) {
    return <BackIcon className="fa fa-chevron-left" onClick={props.onClick}/>
}