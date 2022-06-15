import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
    Box,
    InputAdornment,
    Checkbox,
    OutlinedInput,
    TextField,
} from "@material-ui/core";
import { GROVE_ADDR, GROVE_FARM } from '../../abis/address'
import ERC20ABI from '../../abis/ERC20ABI.json'
import FarmABI from '../../abis/FarmABI.json'
import PancakePairABI from '../../abis/PancakePairABI.json';
import Modal from 'react-modal';
import axios from 'axios';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs'
import { CgArrowsExchangeAlt } from 'react-icons/cg';
import { MdOutlineClose } from 'react-icons/md';
import { Skeleton } from "@material-ui/lab";
import { ethers } from "ethers";
import { useWeb3Context } from "../../hooks/web3Context";

const customStyles = {
    content: {
        top: 'calc(50%)',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        height: 'calc(100vh - 150px)',
        width: '100%',
        maxWidth: '500px',
        transform: 'translate(-50%, -50%)',
        fontFamily: 'Rubik',
        borderRadius: '20px'
    },
};

const customStyles1 = {
    content: {
        top: 'calc(50%)',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        width: '100%',
        maxWidth: '500px',
        transform: 'translate(-50%, -50%)',
        fontFamily: 'Rubik',
        borderRadius: '20px'
    },
};

const compound = [8.678, 7.881, 7.1, 5.746];
const Farm = ({ account, balance, allow, performancefee, rate, tokenprice, price, totalStake, farminfo }) => {
    const [pending, setPending] = useState(false);
    const [modalopen, setModalOpen] = useState(0);
    const [amount, setAmount] = useState('0');

    const [showdetail, setShowDetail] = useState(false);

    const [calcmodal, setCalcModal] = useState(false);
    const [showcalcdetail, setShowCalcDetail] = useState(false);
    const [calcshowtype, setCalcShowType] = useState(false);
    const [calcamount, setCalcAmount] = useState('0');
    const [stakeday, setStakeDay] = useState(365);
    const [compoundday, setCompoundDay] = useState(-1);
    const [compoundcalc, setCompoundCalc] = useState(false);
    const [insufficient, setInsufficient] = useState(false);

    const { connect, hasCachedProvider, provider, chainID, connected } = useWeb3Context();

    const onWithdraw = async () => {
        setPending(true);
        const farmContract = new ethers.Contract(GROVE_FARM, FarmABI, provider.getSigner());
        try {
            const tx = await farmContract.withdraw(0, ethers.utils.parseEther(amount));
            await tx.wait();
        }
        catch (error) {
            console.log(error);
        }
        setPending(false)
    }

    const onDeposit = async () => {
        setPending(true);
        let temp = amount.split('.')[1];
        console.log(temp);
        if (temp && temp.length > 15)
            temp = amount.slice(0, amount.length - 2);
        else temp = amount;
        const farmContract = new ethers.Contract(GROVE_FARM, FarmABI, provider.getSigner());
        try {
            const tx = await farmContract.deposit(0, ethers.utils.parseEther(temp));
            await tx.wait();
        }
        catch (error) {
            console.log(error);
        }
        setPending(false);
    }

    const onHarvest = async () => {
        setPending(true);
        const farmContract = new ethers.Contract(GROVE_FARM, FarmABI, provider.getSigner());
        try {
            const tx = await farmContract.deposit(0, 0, { value: performancefee });
            await tx.wait();
        }
        catch (error) {
            console.log(error);
        }
        setPending(false);
    }

    const onApproveContract = async () => {
        setPending(true);
        try {
            const lpTokenContract = new ethers.Contract(farminfo.pool.lpToken, ERC20ABI, provider.getSigner());
            const tx = await lpTokenContract.approve(GROVE_FARM, "115792089237316195423570985008687907853269984665640564039457584007913129639935");
            await tx.wait();
        }
        catch (error) {
            console.log(error);
        }
        setPending(false);
    }

    function numberWithCommas(x) {
        if (!x) return;
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const CalculateRate = () => {
        if (compoundcalc)
            return Number(stakeday * rate * compound[compoundday] / 36500);
        return Number(stakeday * rate / 36500);
    }

    const inputNumberFormat = (str) => {
        if (!str.length) {
            return '0';
        }

        let temp = str.split('.')[0];
        if (temp === '00' || str === '0')
            return '0';
        else if (temp === '0' && str.includes('.'))
            return str
        else
            return (str.replace(/^0+/, ''));
    }
    return (
        <StyledContainer>
            <Modal
                isOpen={modalopen > 0}
                onRequestClose={() => setModalOpen(0)}
                style={customStyles1}
                contentLabel="Example Modal"
            >
                <Box display={'flex'} justifyContent={'space-between'} mb={'20px'} fontSize={'24px'} py={'20px'} borderBottom={'2px solid rgb(231, 227, 235)'}>
                    <Box>{modalopen === 1 ? 'Stake LP Tokens' : 'Withdraw Lp Tokens'}</Box>
                    <Box onClick={() => setModalOpen(0)}><MdOutlineClose /></Box>
                </Box>
                <Box display={'flex'} justifyContent={'end'} fontSize={'18px'} mb={'5px'}>
                    {modalopen === 1 ? 'Balance' : 'Staked Amount'} : {(modalopen === 1 ? balance.toFixed(5) : farminfo?.userinfo?.amount.toFixed(5))}
                </Box>
                <CustomInput className="amountinput" type="number" value={amount}
                    endAdornment={
                        <InputAdornment position="start">
                            <Box
                                style={{ cursor: "pointer", background: "rgb(64 75 151)" }}
                                color={"white"}
                                padding={"10px"}
                                borderRadius={"10px"}
                                fontSize={"30px"}
                                onClick={() => { setAmount(modalopen === 1 ? balance.toString() : farminfo?.userinfo?.amount.toString()) }}
                            >
                                MAX
                            </Box>
                        </InputAdornment>
                    }
                    onKeyPress={(event) => {
                        if ((event?.key === '-' || event?.key === '+')) {
                            event.preventDefault();
                        }
                    }}
                    onChange={(event) => {
                        if (event.target.value / 1 < 0)
                            return;
                        if (event.target.value / 1 > (modalopen === 1 ? balance : farminfo?.userinfo?.amount))
                            setInsufficient(true);
                        else setInsufficient(false);
                        setAmount(inputNumberFormat(event.target.value));
                    }} />
                {insufficient ? <Box color={'tomato'} display={'flex'} justifyContent={'end'}>
                    Insufficient LP Token Balance
                </Box> : ''}
                <ModalActions>
                    <ModalButton onClick={() => setModalOpen(0)}>Cancel</ModalButton>
                    <ModalButton disabled={!(modalopen === 1 ? balance : farminfo?.userinfo?.amount) || insufficient} onClick={() => modalopen === 1 ? onDeposit() : onWithdraw()}>Confirm</ModalButton>
                </ModalActions>
            </Modal>

            <Modal
                isOpen={calcmodal}
                onRequestClose={() => setCalcModal(false)}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <Box display={'flex'} justifyContent={'space-between'} mb={'20px'} fontSize={'24px'} py={'20px'} borderBottom={'2px solid rgb(231, 227, 235)'}>
                    <Box>ROI Calculator</Box>
                    <Box onClick={() => setCalcModal(false)}><MdOutlineClose /></Box>
                </Box>
                <Box display={'flex'} justifyContent={'space-between'} fontSize={'18px'} mb={'5px'}>
                    <Box>
                        = {calcshowtype ? numberWithCommas((Number(calcamount) / price).toFixed(2))
                            : numberWithCommas(Number(price * Number(calcamount)).toFixed(2))} {calcshowtype ? 'GVR-BNB' : 'USD'}
                    </Box>
                    <Box>
                        Balance : {calcshowtype ? numberWithCommas(Number(balance * price).toFixed(2)) :
                            numberWithCommas(Number(balance).toFixed(2))}
                    </Box>
                </Box>
                <CustomInput className="amountinput" type="number" value={calcamount}
                    endAdornment={
                        <InputAdornment position="start">
                            <Box display={'flex'} alignItems={'center'}>
                                <Box fontSize={'14px'} mr={'5px'}>{calcshowtype ? 'USD' : 'GVR-BNB '}</Box>
                                <Box mr={'10px'} fontSize={'32px'} style={{ cursor: 'pointer' }} onClick={() => setCalcShowType(!calcshowtype)}>
                                    <CgArrowsExchangeAlt />
                                </Box>
                                <Box
                                    style={{ cursor: "pointer", background: "rgb(64 75 151)" }}
                                    color={"white"}
                                    padding={"10px"}
                                    borderRadius={"10px"}
                                    fontSize={"30px"}
                                    onClick={() => {
                                        setCalcAmount(calcshowtype ? balance * price :
                                            balance)
                                    }}
                                >
                                    MAX
                                </Box>
                            </Box>
                        </InputAdornment>
                    }
                    onChange={(event) => {
                        if (event.target.value / 1 < 0)
                            return;
                        setCalcAmount(inputNumberFormat(event.target.value));
                    }} />
                <Box mt={'40px'} fontSize={'18px'}>
                    STAKED FOR
                </Box>
                <DaySelectPanel>
                    <DaySelectCard active={stakeday === 1} onClick={() => setStakeDay(1)} width={'20%'}>1D</DaySelectCard>
                    <DaySelectCard active={stakeday === 7} onClick={() => setStakeDay(7)} width={'20%'}>7D</DaySelectCard>
                    <DaySelectCard active={stakeday === 30} onClick={() => setStakeDay(30)} width={'20%'}>30D</DaySelectCard>
                    <DaySelectCard active={stakeday === 365} onClick={() => setStakeDay(365)} width={'20%'}>1Y</DaySelectCard>
                    <DaySelectCard active={stakeday === 365 * 5} onClick={() => setStakeDay(365 * 5)} width={'20%'}>5Y</DaySelectCard>
                </DaySelectPanel>
                <Box mt={'40px'} fontSize={'18px'}>
                    COMPOUNDING EVERY
                </Box>
                <Box display={'flex'}>
                    <Checkbox checked={compoundcalc} onChange={() => {
                        if (compoundday === -1)
                            setCompoundDay(0);
                        if (compoundcalc)
                            setCompoundDay(-1);
                        setCompoundCalc(!compoundcalc)
                    }} />
                    <DaySelectPanel>
                        <DaySelectCard active={compoundday === 0} onClick={() => compoundcalc && setCompoundDay(0)} width={'25%'}>1D</DaySelectCard>
                        <DaySelectCard active={compoundday === 1} onClick={() => compoundcalc && setCompoundDay(1)} width={'25%'}>7D</DaySelectCard>
                        <DaySelectCard active={compoundday === 2} onClick={() => compoundcalc && setCompoundDay(2)} width={'25%'}>14D</DaySelectCard>
                        <DaySelectCard active={compoundday === 3} onClick={() => compoundcalc && setCompoundDay(3)} width={'25%'}>30D</DaySelectCard>
                    </DaySelectPanel>
                </Box>

                <Box borderRadius={'16px'} mt={'40px'} border={'1px solid black'} padding={'30px'} mx={'20px'} mb={'20px'}>
                    <Box fontSize={'18px'} >ROI AT CURRENT RATES</Box>
                    <Box fontSize={'28px'} mt={'10px'} fontWeight={'bold'}>${
                        numberWithCommas((calcshowtype ? Number(calcamount) * CalculateRate() :
                            Number(calcamount) * price * CalculateRate()).toFixed(2))}</Box>
                    <Box mt={'10px'} fontWeight={'bold'}> ~ {
                        calcshowtype ? (Number(calcamount) * CalculateRate() / price).toFixed(3) :
                            (Number(calcamount) * CalculateRate()).toFixed(3)} GVR-BNB({(CalculateRate() * 100).toFixed(2)}%)</Box>
                </Box>

                <Box display={'flex'} justifyContent={'center'} padding={'10px 0'}>
                    <Box display={'flex'} alignItems={'center'} style={{ cursor: 'pointer' }} onClick={() => setShowCalcDetail(!showcalcdetail)}>
                        <Box mr={'20px'} fontSize={'21px'}>
                            {showcalcdetail ? 'Hide' : 'Details'}
                        </Box>
                        {showcalcdetail ? <BsChevronUp /> : <BsChevronDown />}
                    </Box>
                </Box>

                {showcalcdetail ? <Box px={'20px'} fontSize={'18px'} mt={'20px'}>
                    <Box display={'flex'} justifyContent={'space-between'}>
                        <Box>APR</Box>
                        <Box>{rate.toFixed(2)}%</Box>
                    </Box>
                    <Box display={'flex'} justifyContent={'space-between'} mt={'10px'}>
                        <Box>APY (1x daily compound)</Box>
                        <Box>{(rate * rate * compound[0]).toFixed(2)}%</Box>
                    </Box>
                    <Box fontSize={'16px'} my={'20px'}>
                        Calculated based on current rates.<br />
                        All figures are estimates provided for your convenience only, and by no means represent guaranteed returns.
                    </Box>
                </Box> : ''}
            </Modal>

            <Box display={'flex'} justifyContent={'center'}>
                <Paper width={'100%'} maxWidth={'600px'} height={'fit-content'}>
                    <Box fontSize={'32px'}>Farm</Box>
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Box mt={'20px'}>
                            <Box width={'40px'} height={'40px'}>
                                <img src={'/images/bnb.png'} width={'100%'} height={'100%'} alt={'bnb'} />
                            </Box>
                            <Box position={'relative'} mt={'-30px'} ml={'10px'} width={'60px'} height={'60px'} bgcolor={'white'} borderRadius={'50%'}>
                                <img src={'/images/gov.png'} width={'100%'} height={'100%'} alt={'gov'} />
                            </Box>
                        </Box>
                        <Box fontSize={'32px'}>
                            GVR-BNB
                        </Box>
                    </Box>
                    <Box mt={'20px'} fontSize={'24px'} fontWeight={'bold'} display={'flex'} justifyContent={'space-between'}>
                        <Box color={'lightgrey'}>
                            APR:
                        </Box>
                        {rate ?
                            <Box fontWeight={'bold'} display={'flex'} alignItems={'center'} style={{ cursor: 'pointer' }} onClick={() => setCalcModal(true)}>
                                <Box>
                                    {Number(rate).toFixed(2)} %
                                </Box>
                                <Box ml={'5px'} mt={'8px'}>
                                    <img src='/images/operation.svg' alt='operation' />
                                </Box>
                            </Box> :
                            <Skeleton variant={'text'} width={'120px'} height={'100%'} style={{ transform: 'unset' }} />
                        }
                    </Box>
                    <Box mt={'20px'} fontSize={'21px'} display={'flex'} justifyContent={'space-between'}>
                        <Box color={'lightgrey'}>
                            Earn:
                        </Box>
                        <Box fontWeight={'bold'}>
                            GVR
                        </Box>
                    </Box>
                    <Box mt={'20px'} fontSize={'18px'} display={'flex'} justifyContent={'space-between'}>
                        <Box color={'lightgrey'}>
                            Deposit Fee:
                        </Box>
                        {farminfo ?
                            <Box fontWeight={'bold'}>
                                {Number(farminfo?.pool.depositFee).toFixed(2)}%
                            </Box> :
                            <Skeleton variant={'text'} width={'60px'} height={'100%'} style={{ transform: 'unset' }} />
                        }
                    </Box>
                    <Box fontSize={'18px'} display={'flex'} justifyContent={'space-between'}>
                        <Box color={'lightgrey'}>
                            Withdraw Fee:
                        </Box>
                        {farminfo ?
                            <Box fontWeight={'bold'}>
                                {Number(farminfo?.pool.withdrawFee).toFixed(2)}%
                            </Box> :
                            <Box mt={'5px'}>
                                <Skeleton variant={'text'} width={'60px'} height={'100%'} style={{ transform: 'unset' }} />
                            </Box>
                        }
                    </Box>
                    <Box fontSize={'18px'} display={'flex'} justifyContent={'space-between'}>
                        <Box color={'lightgrey'}>
                            GVR Reflected
                        </Box>
                        {farminfo ?
                            <Box fontWeight={'bold'}>
                                {numberWithCommas(Number(farminfo?.reflection.pending).toFixed(3))}
                            </Box> :
                            <Box mt={'5px'}>
                                <Skeleton variant={'text'} width={'60px'} height={'100%'} style={{ transform: 'unset' }} />
                            </Box>
                        }
                    </Box>
                    <Box fontSize={'18px'} display={'flex'} justifyContent={'space-between'}>
                        <Box color={'lightgrey'}>
                            GVR Earned
                        </Box>
                    </Box>
                    <DataField >
                        <Box>
                            {farminfo ?
                                <Box color={'lightgrey'} fontWeight={'bold'}>
                                    {numberWithCommas(Number(farminfo?.reward.pending).toFixed(3))}
                                </Box> :
                                <Skeleton variant={'text'} width={'120px'} height={'100%'} style={{ transform: 'unset' }} />
                            }
                            {farminfo ?
                                <Box color={'white'} fontSize={'16px'}>
                                    {numberWithCommas(Number(farminfo?.reward.pending * tokenprice).toFixed(2))} USD
                                </Box> :
                                <Box mt={'5px'}>
                                    <Skeleton variant={'text'} width={'60px'} height={'100%'} style={{ transform: 'unset' }} />
                                </Box>
                            }
                        </Box>
                        <Box>
                            <StyledButton onClick={() => onHarvest()} disabled={pending || !Number(farminfo?.reward.pending)}>
                                Harvest
                            </StyledButton>
                        </Box>
                    </DataField>
                    <Box mt={'20px'} fontSize={'18px'} display={'flex'} justifyContent={'space-between'}>
                        <Box color={'lightgrey'}>
                            GVR-BNB LP Staked
                        </Box>
                    </Box>
                    {allow ? <DataField >
                        <Box>
                            <Box color={'lightgrey'} fontWeight={'bold'}>
                                {numberWithCommas(Number(farminfo?.userinfo?.amount).toFixed(3))}
                            </Box>
                            <Box color={'white'} fontSize={'16px'}>
                                {numberWithCommas(Number(farminfo?.userinfo?.amount * price).toFixed(2))} USD
                            </Box>
                        </Box>
                        <Box>
                            <StyledButton onClick={() => setModalOpen(1)} disabled={pending}>
                                Stake LP
                            </StyledButton>
                            <Box mt={'5px'}>
                                {
                                    farminfo?.userinfo?.amount ?
                                        <StyledButton onClick={() => setModalOpen(2)} disabled={pending}>
                                            Withdraw LP
                                        </StyledButton> : ''
                                }
                            </Box>
                        </Box>
                    </DataField> :
                        <StyledButton style={{ width: '100%' }} onClick={() => onApproveContract()} disabled={pending || !farminfo?.pool.lpToken || !account}>
                            Enable Contract
                        </StyledButton>
                    }
                    <Box display={'flex'} justifyContent={'center'} pt={'10px'} mt={'10px'}>
                        <Box display={'flex'} alignItems={'center'} style={{ cursor: 'pointer' }} onClick={() => setShowDetail(!showdetail)}>
                            <Box mr={'20px'} fontSize={'21px'}>
                                {showdetail ? 'Hide' : 'Details'}
                            </Box>
                            {showdetail ? <BsChevronUp /> : <BsChevronDown />}
                        </Box>
                    </Box>

                    {showdetail ? <Box mt={'20px'} fontSize={'18px'}>
                        <Box display={'flex'} justifyContent={'space-between'}>
                            <Box>Total Liquidity: </Box>
                            <Box>${numberWithCommas((totalStake * price).toFixed(2))}</Box>
                        </Box>
                        <Box display={'flex'} >
                            <a href={'https://bscscan.com/address/0xb14173e6E9790C346aCfe9BC02b54AA81841427A'} target={'_blank'} style={{ textDecoration: 'none', color: 'white' }}>
                                View Lp Token
                            </a>
                        </Box>
                        <Box display={'flex'} >
                            <a href={'https://pancakeswap.finance/info/pool/0xb14173e6E9790C346aCfe9BC02b54AA81841427A'} target={'_blank'} style={{ textDecoration: 'none', color: 'white' }}>
                                See Pair Info
                            </a>
                        </Box>
                    </Box> : ''
                    }
                </Paper>
            </Box >
        </StyledContainer >
    );
};
const StyledContainer = styled(Box)`
  min-height: 100vh;
  width: 100%;
  background-image: url("/images/background.jpg");
  position: relative;
  padding : 0px 100px;
  padding-top: 150px;
  color : white;
  padding-bottom : 50px;
  background-size : 100% 100%;
  @media screen and (max-width : 800px){
    background-color : white;
    background-repeat : repeat-y;
    background-position : top;
    background-size : unset;
    padding-left : 20px;
    padding-right : 20px;
  }
`;

const Paper = styled(Box)`
  width : fit-content;
  box-shadow : 0 0px 20px 0 rgb(64 75 151), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  background: rgb(23 34 108 / 60%);
  padding : 30px 50px;
  border-radius : 12px;
  @media screen and (max-width : 450px){
      padding : 30px 20px;
  }
`;
const StyledButton = styled.button`
    text-align : center;
    border : 2px solid rgb(98,106,146);
    background : transparent;
    color : white;
    padding : 10px 0px;
    width : 170px;
    font-size : 21px;
    border-radius : 10px;
    cursor : pointer;
    transition : all 0.3s;
    :hover{
        background rgb(98,106,146);
    }
    :disabled{
        background : rgba(112,125,162,0.3);
        color : rgb(189, 194, 196);
        cursor : not-allowed;
        border : none;
    }
`

const ModalButton = styled.button`
    text-align : center;
    border : 2px solid rgb(98,106,146);
    background : white;
    color : black;
    padding : 10px 70px;
    font-size : 21px;
    border-radius : 20px;
    cursor : pointer;
    transition : all 0.3s;
    :hover{
        background : rgb(98,106,146);
        color : white;
    }
    :disabled{
        background : rgb(233, 234, 235);
        color : rgb(189, 194, 196);
        cursor : not-allowed;
        border : none;
    }
`

const CustomInput = styled(OutlinedInput)`
    font-size: 20px !important;
    width: 100%;
    border-radius: 10px!important;
    border : 1px solid rgb(64 75 151);
    color : black!important;
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none; 
    }
    margin: 0; 
`;
const DaySelectPanel = styled(Box)`
    background-color: rgb(239, 244, 245);
    border-radius: 16px;
    display: inline-flex;
    border: 1px solid rgb(233, 234, 235);
    width : 100%;
    font-size : 21px;
    >div{
        display : flex;
        justify-content : center;
        align-items : center;
        cursor : pointer;
        padding : 10px 0px;
    }
`;

const DaySelectCard = styled(Box)`
    background-color: ${({ active }) => active ? 'rgb(15, 33, 49)' : 'unset'};
    color: ${({ active }) => active ? 'white' : 'unset'};
    border-radius : 16px;
    transition : all 0.2s;
`;

const ModalActions = styled(Box)`
    display : flex;
    justify-content : space-between;
    margin-top : 40px;
    @media screen and (max-width : 500px){
        flex-direction : column;
        >button{
            width : 100%;
            margin-bottom : 10px;
        }
    }
`

const DataField = styled(Box)`
    font-size : 24px;
    display : flex;
    justify-content : space-between;
    align-items : center;
    @media screen and (max-width : 600px){
        flex-direction : column;
    }
`;
export default Farm;
