import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
    Box,
} from "@material-ui/core";
import StyledButton from '../../components/StyledButton'
import { useMediaQuery } from '@material-ui/core'

const ShareHolder = ({ account, curpage, setCurPage }) => {

    const sm = useMediaQuery("(max-width: 1440px)");
    const xs = useMediaQuery("(max-width: 750px");

    const ellipsis = xs ? '0xD47688db67211nvf196...' : '0xD47688db67211nvf1960edzzb';
    return (
        <>
            <Box fontSize={xs ? '29px' : '70px'} fontWeight={600} textAlign={'center'} lineHeight={xs ? '34px' : '83px'} >
                <span style={{ color: '#00E9C8' }}>Bloc</span>Vest Triple Vault
            </Box>
            <ShardHolders mt={xs ? '31px' : '65px'} active={curpage === 1}>
                <Box width={'455px'} position={'relative'} onClick={() => sm && (curpage === 1 ? setCurPage(0) : setCurPage(1))} >
                    <Box fontSize={xs ? '24px' : '36px'} lineHeight={xs ? '41px' : '55px'} fontWeight={'700'} textAlign={xs && curpage !== 1 ? 'center' : 'left'}>Shareholders Vault</Box>
                    <Box pt={xs ? '12px' : '18px'} fontWeight={'500'} lineHeight={xs ? '14px' : '19px'} pb={xs ? '40px' : '80px'} fontSize={xs ? '12px' : '16px'}>
                        When you enter this vault your tokens will be locked for 6 months from the date you enter.
                        <br /> <br />
                        If you add to your tokens the lock will enter a new 6 month period.
                        <br /> <br />
                        Earn your share of the 50% allocation to this vault from all buy & sell tax.
                    </Box>
                    <Box color={'#00E9C8'} textAlign={'center'} position={'absolute'} width={xs ? 'calc(100% - 62px)' : 'calc(100% - 76px)'} fontWeight={'500'} top={xs ? '10px' : '16px'} fontSize={xs ? '16px' : '20px'} display={'none'}>VIEW</Box>
                </Box>
                <Box width={'503px'}>
                    <InfoPanel>
                        <Box color={'#131043'}>Wallet Address</Box>
                        <Box fontWeight={600}>{ellipsis}</Box>
                    </InfoPanel>
                    <Box display={'flex'} alignItems={'center'} mt={'10px'}>
                        <InfoPanel mr={'12px'}>
                            <Box color={'#131043'}>Token Amount </Box>
                            <Box fontWeight={600} fontSize={xs ? '15px' : '20px'}>25,000.00</Box>
                        </InfoPanel>
                        <StyledButton width={xs ? '46px' : '63px'} height={'33px'}>MAX</StyledButton>
                    </Box>
                    <Box mt={'20px'} display={'flex'} justifyContent={'space-between'} >
                        <StyledButton width={xs ? '98px' : '124px'} height={'33px'}>
                            ENTER VAULT
                        </StyledButton>
                        <StyledButton width={xs ? '80px' : '109px'} height={'33px'}>
                            EXIT VAULT
                        </StyledButton>
                    </Box>
                    <Box mt={xs ? '53px' : '127px'} borderTop={'2px solid #FFFFFF'} pt={'30px'}>
                        <Box display={'flex'} justifyContent={'space-between'} alignItems={xs ? 'end' : 'center'} flexDirection={xs ? 'column-reverse' : 'row'}>
                            <StyledButton type={'secondary'} width={xs ? '135px' : '184px'} height={'33px'} >
                                CLAIM MY REWARDS
                            </StyledButton>
                            <Box ml={xs ? '0' : '14px'} padding={xs ? '10px' : '15px'} textAlign={'right'} bgcolor={'white'} borderRadius={'9px'} fontSize={xs ? '15px' : '20px'} fontWeight={600} width={xs ? '100%' : '210px'} color={'#131043'} mb={xs ? '10px' : '0'}>
                                2,500.00
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box width={'397px'}>
                    <Box fontSize={xs ? '15px' : '20px'} lineHeight={xs ? '35px' : '45px'} fontWeight={600}>MY SHARE</Box>
                    <Box display={'flex'} justifyContent={'space-between'} lineHeight={'13px'} mt={'12px'} color={'#96A7AF'} fontSize={xs ? '12px' : '16px'}>
                        <Box>YOUR BVST TOTAL</Box>
                        <Box>YOUR SHARE % </Box>
                    </Box>
                    <Box display={'flex'} justifyContent={'space-between'} fontSize={xs ? '15px' : '20px'} lineHeight={xs ? '18px' : '24px'} fontWeight={500}>
                        <Box>25,000</Box>
                        <Box>.132%</Box>
                    </Box>
                    <Box display={'flex'} justifyContent={'space-between'} lineHeight={xs ? '14px' : '19px'} mt={'22px'} color={'#96A7AF'} fontSize={xs ? '12px' : '16px'}>
                        <Box>NEXT BUSD  SHARE</Box>
                        <Box>TOTAL BUSD </Box>
                    </Box>
                    <Box display={'flex'} justifyContent={'space-between'} fontSize={xs ? '15px' : '20px'} lineHeight={xs ? '18px' : '24px'} fontWeight={500}>
                        <Box>25,000</Box>
                        <Box>25,000</Box>
                    </Box>
                    <Box mt={xs ? '30px' : '35px'} height={'2px'} bgcolor={'white'} width={'100%'} />
                    <Box fontSize={xs ? '15px' : '20px'} lineHeight={xs ? '35px' : '45px'} fontWeight={600} mt={'13px'}>VAULT OVERVIEW</Box>
                    <Box display={'flex'} justifyContent={'space-between'} lineHeight={'13px'} mt={'16px'} color={'#96A7AF'} fontSize={xs ? '12px' : '16px'}>
                        <Box>TOTAL BVST </Box>
                        <Box>BUSD THIS PERIOD  </Box>
                    </Box>
                    <Box display={'flex'} justifyContent={'space-between'} fontSize={xs ? '15px' : '20px'} lineHeight={xs ? '18px' : '24px'} fontWeight={500}>
                        <Box>235,000.00</Box>
                        <Box>$2,500.00</Box>
                    </Box>
                    <Box mt={'23px'} height={'2px'} bgcolor={'white'} width={'100%'} />
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} color={'#00D8BD'} mt={'24px'}>
                        <Box width={'82px'} lineHeight={'16px'} fontSize={xs ? '12px' : '16px'}>BUSD<br /> ALL TIME</Box>
                        <Box fontSize={xs ? '24px' : '36px'} fontWeight={500} lineHeight={'43px'}>$23,500.00</Box>
                    </Box>
                </Box>
            </ShardHolders>
        </>
    );
};

const ShardHolders = styled(Box)`
    display : flex;
    justify-content : space-between;
    height : 470px;
    >div{
        height : 100%;
        box-shadow: 0px 4px 7px rgba(0, 0, 0, 0.35);
        border-radius: 22px;
    }
    >div:nth-child(1){
        background: #D7DDEC;
        padding : 38px 48px;
        color : #131043;
    }
    >div:nth-child(2){
        padding : 51px 48px 40px 48px;
        background: rgba(136, 144, 167, 0.84);
    }
    >div:nth-child(3){
        padding : 40px 46px 40px 46px;
        background: #4D5772;
        color : white;
    }
    @media screen and (max-width : 1440px){
        flex-direction : column;
        width : fit-content;
        margin : 0 auto;
        height : fit-content;
        width : 700px;
        >div{
            width : 100%;
            margin-bottom : ${({ active }) => active ? '30px' : '0'};
            display : ${({ active }) => active ? 'block' : 'none'};
        }
        >div:nth-child(1){
            padding : 46px 48px;
            display : block;
            >div:nth-child(2){
                display : ${({ active }) => active ? 'block' : 'none'};
            }
            >div:nth-child(3){
                display : ${({ active }) => !active ? 'block' : 'none'};
            }
            cursor : pointer;
        }
    }
    @media screen and (max-width : 750px){
        width : 300px;
        >div:nth-child(1){
            padding : ${({ active }) => active ? '27px 32px' : '32px'};
        }
        >div:nth-child(2){
            padding : 30px 15px;
        }
        >div:nth-child(3){
            padding : 18px 12px 25px 12px;
          
        }
    }
`;

const InfoPanel = styled(Box)`
    font-size : 16px;
    background-color : rgba(255, 255, 255, 0.3);
    border-radius : 9px;
    width : 100%;
    height : 52px;
    display : flex;
    justify-content : space-between;
    align-items : center;
    padding : 0 14px;
    @media screen and (max-width : 750px){
        font-size : 12px;
        height :43px;
        padding : 0 8px;
    }
`;

export default ShareHolder;
