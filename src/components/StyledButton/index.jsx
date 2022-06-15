import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
    Box,
} from "@material-ui/core";


const StyledButton = ({ type, width, height, onClick, children }) => {

    return (
        <>
            <Button type={type} width={width} height={height} onClick={() => onClick ? onClick() : ''}>
                {children}
            </Button>
        </>
    );
};

const Button = styled.button`
    box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.2);
    border-radius: 9px;
    width : ${({ width }) => width};
    height : ${({ height }) => height};
    font-weight : 500;
    background : ${({ type }) => type === 'secondary' ? 'linear-gradient(to right,#00D8BD,#00D8BD,#043cb4,#0251b3)' : '#131043'};
    font-family : 'Rubik';
    border : none;
    display : flex;
    justify-content : center;
    align-items : center;
    cursor : pointer;
    
    transition: all .3s ease-in-out;

    background-size: 300% 100%;
    :hover{
        ${({ type }) => type === 'secondary' ? 'background-position : 100% 0;' : ''};
        ${({ type }) => type !== 'secondary' ? 'background : #00D8BD;' : ''};
    }
    color : white;
    font-size : 16px;

    @media screen and (max-width : 750px){
        font-size : 12px;
    }
`;

export default StyledButton;
