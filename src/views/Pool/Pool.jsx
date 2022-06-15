import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
    Box,
    Checkbox,
    InputAdornment,
    MenuItem,
    OutlinedInput,
    TextField,
} from "@material-ui/core";
import { GROVE_ADDR, GROVE_UNLOCK, GROVE_LOCK } from '../../abis/address'
import ERC20ABI from '../../abis/ERC20ABI.json'
import UnLockABI from '../../abis/UnLockABI.json'
import LockABI from '../../abis/LockABI.json'
import PancakePairABI from '../../abis/PancakePairABI.json';
import Modal from 'react-modal';
import axios from 'axios';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs'
import { CgArrowsExchangeAlt } from 'react-icons/cg'
import { MdOutlineClose } from 'react-icons/md'
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

const unlockcompound = [447.33 / 170.39 / 170.39, 434.74 / 170.39 / 170.39, 420.95 / 170.39 / 170.39, 392.69 / 170.39 / 170.39];
const lockcompound = [
    [1135.04 / 252.24 / 252.24, 1074.30 / 252.24 / 252.24, 1010.83 / 252.24 / 252.24, 889.68 / 252.24 / 252.24],
    [1982.22 / 304.87 / 304.87, 1835.37 / 304.87 / 304.87, 1687.16 / 304.87 / 304.87, 1418.83 / 304.87 / 304.87],
    [2100.80 / 310.45 / 310.45, 1940.19 / 310.45 / 310.45, 1778.71 / 310.45 / 310.45, 1488.07 / 310.45 / 310.45]
]
const Pool = ({ account, unlockinfo, unlockallow, lockinfo, lockallow, lockups }) => {
    const [pending, setPending] = useState(false);

    const [modalopen, setModalOpen] = useState(0);
    const [amount, setAmount] = useState('0');

    const [modalbalance, setModalBalance] = useState(0);
    const [calcmodal, setCalcModal] = useState(0);
    const [calcamount, setCalcAmount] = useState('0');
    const [stakeday, setStakeDay] = useState(365);
    const [compoundday, setCompoundDay] = useState(-1);
    const [showcalcdetail, setShowCalcDetail] = useState(false);
    const [compoundcalc, setCompoundCalc] = useState(false);
    const [calcshowtype, setCalcShowType] = useState(false);
    const [showunlockdetail, setShowUnlockDetail] = useState(false);
    const [showlockdetail, setShowLockDetail] = useState(-1);

    const { connect, hasCachedProvider, provider, chainID, connected } = useWeb3Context();

    const onConfirm = async () => {
        setPending(true);
        let temp = amount.split('.')[1];
        if (temp)
            temp = amount.slice(0, amount.length - 2);
        else temp = amount;
        try {
            if (modalopen % 10 === 1) {
                const unLockContract = new ethers.Contract(GROVE_UNLOCK, UnLockABI, provider.getSigner());
                if (modalopen === 1) {
                    await unLockContract.deposit(ethers.utils.parseEther(temp));
                }
                else
                    await unLockContract.withdraw(ethers.utils.parseEther(temp));
            }
            else {
                const LockContract = new ethers.Contract(GROVE_LOCK, LockABI, provider.getSigner());
                if (modalopen < 10) {
                    await LockContract.deposit(ethers.utils.parseEther(temp), modalopen % 10 - 2);
                }
                else
                    await LockContract.withdraw(ethers.utils.parseEther(temp), modalopen % 10 - 2);
            }

        }
        catch (error) {
            console.log(error);
        }
        setPending(false)
    }

    const onCompoundReward = async (i) => {
        setPending(true);
        try {
            if (i === 1) {
                const unLockContract = new ethers.Contract(GROVE_UNLOCK, UnLockABI, provider.getSigner());
                await unLockContract.compoundReward({ value: unlockinfo.performanceFee });
            }
            else {
                const LockContract = new ethers.Contract(GROVE_LOCK, LockABI, provider.getSigner());
                await LockContract.compoundReward(i - 2, { value: lockinfo.performanceFee });
            }
        }
        catch (error) {
            console.log(error);
        }
        setPending(false);
    }
    const onCompoundReflection = async (i) => {
        setPending(true);
        try {
            if (i === 1) {
                const unLockContract = new ethers.Contract(GROVE_UNLOCK, UnLockABI, provider.getSigner());
                await unLockContract.compoundDividend({ value: unlockinfo.performanceFee });
            }
            else {
                const LockContract = new ethers.Contract(GROVE_LOCK, LockABI, provider.getSigner());
                await LockContract.compoundDividend(i - 2, { value: lockinfo.performanceFee });
            }
        }
        catch (error) {
            console.log(error);
        }
        setPending(false);

    }
    const onHarvestReward = async (i) => {
        setPending(true);
        try {
            if (i === 1) {
                const unLockContract = new ethers.Contract(GROVE_UNLOCK, UnLockABI, provider.getSigner());
                await unLockContract.claimReward({ value: unlockinfo.performanceFee });
            }
            else {
                const LockContract = new ethers.Contract(GROVE_LOCK, LockABI, provider.getSigner());
                await LockContract.claimReward(i - 2, { value: lockinfo.performanceFee });
            }
        }
        catch (error) {
            console.log(error);
        }
        setPending(false);
    }
    const onHarvestReflection = async (i) => {
        setPending(true);
        try {
            if (i === 1) {
                const unLockContract = new ethers.Contract(GROVE_UNLOCK, UnLockABI, provider.getSigner());
                await unLockContract.claimDividend({ value: unlockinfo.performanceFee });
            }
            else {
                const LockContract = new ethers.Contract(GROVE_LOCK, LockABI, provider.getSigner());
                await LockContract.claimDividend(i - 2, { value: lockinfo.performanceFee });
            }
        }
        catch (error) {
            console.log(error);
        }
        setPending(false);
    }

    const onApproveContract = async (type, address) => {
        // setPending(true);
        try {
            const tokenContract = new ethers.Contract(address, ERC20ABI, provider.getSigner());
            await tokenContract.approve(type === 1 ? GROVE_UNLOCK : GROVE_LOCK, "115792089237316195423570985008687907853269984665640564039457584007913129639935");
            // setPending(false);
        }
        catch (error) {
            console.log(error);
            // setPending(false);
        }
    }

    function numberWithCommas(x) {
        if (!x) return;
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const CalculateRate = (type) => {
        if (type === 1) {
            if (compoundcalc)
                return Number(stakeday * unlockinfo?.rate * unlockinfo?.rate * unlockcompound[compoundday] / 36500);
            return Number(stakeday * unlockinfo?.rate / 36500);
        }
        else if (type > 1) {
            if (compoundcalc)
                return Number(stakeday * lockups[type - 2]?.rate * lockups[type - 2]?.rate * lockcompound[type - 2][compoundday] / 36500);
            return Number(stakeday * lockups[type - 2]?.rate / 36500);
        }
        else return 0;
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
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} borderBottom={'2px solid rgb(231, 227, 235)'} mb={'20px'} fontSize={'24px'} py={'20px'} >
                    <Box >
                        {modalopen < 10 ? 'Stake Tokens' : 'Withdraw Tokens'}
                    </Box>
                    <Box onClick={() => setModalOpen(0)}><MdOutlineClose /></Box>
                </Box>
                <Box display={'flex'} justifyContent={'end'} fontSize={'18px'} mb={'5px'}>
                    {modalopen < 10 ? 'Balance' : 'Staked Amount'} : {modalbalance}
                </Box>
                <CustomInput className="amountinput" type="number" value={amount.toString()}
                    endAdornment={
                        <InputAdornment position="start">
                            <Box
                                style={{ cursor: "pointer", background: "rgb(64 75 151)" }}
                                color={"white"}
                                padding={"10px"}
                                borderRadius={"10px"}
                                fontSize={"30px"}
                                onClick={() => { setAmount(modalbalance.toString()) }}
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
                        if (event.target.value / 1 < 0 || event.target.value / 1 > modalbalance)
                            return;
                        setAmount(inputNumberFormat(event.target.value));
                    }} />

                <ModalActions>
                    <ModalButton onClick={() => setModalOpen(0)}>Cancel</ModalButton>
                    <ModalButton disabled={!modalbalance} onClick={() => onConfirm()}>Confirm</ModalButton>
                </ModalActions>
            </Modal>

            <Modal
                isOpen={calcmodal > 0}
                onRequestClose={() => setCalcModal(0)}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <Box display={'flex'} justifyContent={'space-between'} mb={'20px'} fontSize={'24px'} py={'20px'} borderBottom={'2px solid rgb(231, 227, 235)'}>
                    <Box>
                        ROI Calculator
                    </Box>
                    <Box onClick={() => setCalcModal(0)}><MdOutlineClose /></Box>
                </Box>
                <Box display={'flex'} justifyContent={'space-between'} fontSize={'18px'} mb={'5px'}>
                    <Box>
                        = {calcshowtype ? numberWithCommas((Number(calcamount) / unlockinfo?.stakingTokenInfo.price).toFixed(2)) :
                            numberWithCommas(Number(unlockinfo?.stakingTokenInfo.price * Number(calcamount)).toFixed(2))} {calcshowtype ? 'GVR' : 'USD'}
                    </Box>
                    <Box>
                        Balance : {calcshowtype ? numberWithCommas(Number(unlockinfo?.stakingTokenInfo.balance * unlockinfo?.stakingTokenInfo.price).toFixed(2)) :
                            numberWithCommas(Number(unlockinfo?.stakingTokenInfo.balance).toFixed(2))}
                    </Box>
                </Box>
                <CustomInput className="amountinput" type="number" value={calcamount.toString()}
                    endAdornment={
                        <InputAdornment position="start">
                            <Box display={'flex'} alignItems={'center'}>
                                <Box fontSize={'14px'} mr={'5px'}>{calcshowtype ? 'USD' : 'GVR '}</Box>
                                <Box mr={'20px'} fontSize={'32px'} style={{ cursor: 'pointer' }} onClick={() => setCalcShowType(!calcshowtype)}>
                                    <CgArrowsExchangeAlt />
                                </Box>
                                <Box
                                    style={{ cursor: "pointer", background: "rgb(64 75 151)" }}
                                    color={"white"}
                                    padding={"10px"}
                                    borderRadius={"10px"}
                                    fontSize={"30px"}
                                    onClick={() => {
                                        setCalcAmount(calcshowtype ? unlockinfo?.stakingTokenInfo.balance * unlockinfo?.stakingTokenInfo.price :
                                            unlockinfo?.stakingTokenInfo.balance)
                                    }}
                                >
                                    MAX
                                </Box>
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
                        numberWithCommas((calcshowtype ? Number(calcamount) * CalculateRate(calcmodal) :
                            Number(calcamount) * unlockinfo?.stakingTokenInfo.price * CalculateRate(calcmodal)).toFixed(2))}</Box>
                    <Box mt={'10px'} fontWeight={'bold'}> ~ {
                        calcshowtype ? (Number(calcamount) * CalculateRate(calcmodal) / unlockinfo?.stakingTokenInfo.price).toFixed(3) :
                            (Number(calcamount) * CalculateRate(calcmodal)).toFixed(3)} GVR({(CalculateRate(calcmodal) * 100).toFixed(2)}%)</Box>
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
                        <Box>{calcmodal === 1 ? unlockinfo?.rate.toFixed(2) : lockups[calcmodal - 2]?.rate.toFixed(2)}%</Box>
                    </Box>
                    <Box display={'flex'} justifyContent={'space-between'} mt={'10px'}>
                        <Box>APY (1x daily compound)</Box>
                        <Box>{calcmodal === 1 ? (unlockinfo?.rate * unlockinfo?.rate * unlockcompound[0]).toFixed(2) : (lockups[calcmodal - 2]?.rate * lockups[calcmodal - 2]?.rate * lockcompound[Math.max(calcmodal - 2, 0)][0]).toFixed(2)}%</Box>
                    </Box>
                    <Box fontSize={'16px'} my={'20px'}>
                        Calculated based on current rates.<br />
                        All figures are estimates provided for your convenience only, and by no means represent guaranteed returns.
                    </Box>
                </Box> : ''}
            </Modal>

            <LockPanel>


                {lockups && lockups.map((data, i) => <Paper width={'600px'} height={'fit-content'}>
                    <Box fontSize={'20px'}>Staking Pool</Box>
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} >
                        <Box>
                            <Box fontSize={'32px'}>
                                Earn GVR
                            </Box>
                            <Box fontSize={'21px'}>
                                Stake GVR
                            </Box>
                            <Box fontSize={'21px'}>
                                Reflection GVR
                            </Box>
                        </Box>
                        <Box >
                            <Box width={'40px'} height={'40px'} bgcolor={'white'} borderRadius={'50%'}>
                                <img src={'/images/gov.png'} width={'100%'} height={'100%'} alt={'bnb'} />
                            </Box>
                            <Box position={'relative'} mt={'-30px'} ml={'10px'} width={'60px'} height={'60px'} bgcolor={'white'} borderRadius={'50%'}>
                                <img src={'/images/gov.png'} width={'100%'} height={'100%'} alt={'gov'} />
                            </Box>
                        </Box>
                    </Box>
                    <DataField>
                        <Box mt={'20px'} fontSize={'24px'} fontWeight={'bold'} display={'flex'} justifyContent={'space-between'}>
                            <Box color={'lightgrey'}>
                                APR:
                            </Box>
                            {
                                data.rate ?
                                    <Box fontWeight={'bold'} display={'flex'} alignItems={'center'} style={{ cursor: 'pointer' }} onClick={() => setCalcModal(2 + i)}>
                                        <Box>
                                            {Number(data.rate).toFixed(2)} %
                                        </Box>
                                        <Box ml={'5px'} mt={'8px'}>
                                            <img src='/images/operation.svg' alt='operation' />
                                        </Box>
                                    </Box>
                                    : <Skeleton variant={'text'} width={'120px'} height={'100%'} style={{ transform: 'unset' }} />
                            }

                        </Box>
                        <Box mt={'20px'} fontSize={'18px'} display={'flex'} justifyContent={'space-between'}>
                            <Box color={'lightgrey'}>
                                Lock Duration:
                            </Box>
                            {
                                data.lockup ?
                                    <Box fontWeight={'bold'}>
                                        {Number(data?.lockup?.duration)}days
                                    </Box>
                                    : <Skeleton variant={'text'} width={'60px'} height={'100%'} style={{ transform: 'unset' }} />
                            }
                        </Box>
                        <Box mt={'20px'} fontSize={'18px'} display={'flex'} justifyContent={'space-between'}>
                            <Box color={'lightgrey'}>
                                Deposit Fee:
                            </Box>
                            {
                                data.lockup ?
                                    <Box fontWeight={'bold'}>
                                        {Number(data?.lockup?.depositFee / 100).toFixed(2)}%
                                    </Box>
                                    :
                                    <Box mb={'5px'}>
                                        <Skeleton variant={'text'} width={'60px'} height={'100%'} style={{ transform: 'unset' }} />
                                    </Box>
                            }
                        </Box>
                        <Box fontSize={'18px'} display={'flex'} justifyContent={'space-between'}>
                            <Box color={'lightgrey'}>
                                Withdraw Fee:
                            </Box>
                            {data.lockup ?
                                <Box fontWeight={'bold'}>
                                    {Number(data?.lockup?.withdrawFee / 100).toFixed(2)}%
                                </Box>
                                : <Skeleton variant={'text'} width={'60px'} height={'100%'} style={{ transform: 'unset' }} />
                            }
                        </Box>

                        <Box mt={'20px'} fontSize={'18px'} display={'flex'} justifyContent={'space-between'}>
                            <Box color={'lightgrey'}>
                                GVR Earned
                            </Box>
                        </Box>
                        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} fontSize={'24px'}>
                            <Box>
                                {data.lockup ?
                                    <Box fontWeight={'bold'}>
                                        {numberWithCommas(Number(data.pendingReward).toFixed(3))}&nbsp;
                                    </Box>
                                    :
                                    <Box mb={'5px'}>
                                        <Skeleton variant={'text'} width={'120px'} height={'100%'} style={{ transform: 'unset' }} />
                                    </Box>
                                }
                                {data.lockup ?
                                    <Box fontSize={'16px'}>
                                        {numberWithCommas(Number(data?.pendingReward * lockinfo?.earnedTokenInfo.price).toFixed(2))} USD
                                    </Box>
                                    :
                                    <Skeleton variant={'text'} width={'60px'} height={'100%'} style={{ transform: 'unset' }} />
                                }
                            </Box>
                            <Box height={'80px'}>
                                {<Box>
                                    <StyledButton
                                        style={{ width: '100px', fontSize: '14px', padding: '5px' }}
                                        disabled={pending || !data?.pendingReward}
                                        onClick={() => onCompoundReward(2 + i)}
                                    >
                                        Compound
                                    </StyledButton>
                                </Box>}
                                {data?.userinfo?.available / 1 ? <Box mt={'5px'}>
                                    <StyledButton
                                        style={{ width: '100px', fontSize: '14px', padding: '5px' }}
                                        disabled={pending || !data?.pendingReward}
                                        onClick={() => onHarvestReward(2 + i)}
                                    >Harvest
                                    </StyledButton>
                                </Box> : ''
                                }
                            </Box>
                        </Box>
                        <Box mt={'20px'} fontSize={'18px'} display={'flex'} justifyContent={'space-between'}>
                            <Box color={'lightgrey'}>
                                GVR Reflected
                            </Box>
                        </Box>
                        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} fontSize={'24px'}>
                            <Box >
                                {data.lockup ?
                                    <Box fontWeight={'bold'} >
                                        {numberWithCommas(Number(data?.pendingReflection).toFixed(3))}
                                    </Box> :
                                    <Box mb={'5px'}>
                                        <Skeleton variant={'text'} width={'120px'} height={'100%'} style={{ transform: 'unset' }} />
                                    </Box>
                                }
                                {data.lockup ?
                                    <Box fontSize={'16px'}>
                                        {numberWithCommas(Number(data?.pendingReflection * lockinfo?.reflectionTokenInfo.price).toFixed(2))} USD
                                    </Box> :
                                    <Skeleton variant={'text'} width={'60px'} height={'100%'} style={{ transform: 'unset' }} />
                                }
                            </Box>
                            <Box>
                                <Box>
                                    <StyledButton
                                        style={{ width: '100px', fontSize: '14px', padding: '5px' }}
                                        disabled={pending || !data?.pendingReflection}
                                        onClick={() => onCompoundReflection(2 + i)}
                                    >
                                        Compound
                                    </StyledButton>
                                </Box>
                                <Box mt={'5px'}>
                                    <StyledButton
                                        style={{ width: '100px', fontSize: '14px', padding: '5px' }}
                                        disabled={pending || !data?.pendingReflection}
                                        onClick={() => onHarvestReflection(2 + i)}
                                    >Harvest
                                    </StyledButton>
                                </Box>
                            </Box>
                        </Box>
                        <Box mt={'20px'} fontSize={'18px'} display={'flex'} justifyContent={'space-between'}>
                            <Box color={'lightgrey'}>
                                GVR Staked
                            </Box>
                        </Box>
                        {lockallow && account ?
                            <Box fontSize={'24px'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                <Box mt={'10px'}>
                                    {
                                        data.userinfo ?
                                            <Box fontWeight={'bold'}>
                                                {numberWithCommas(Number(data?.userinfo?.amount).toFixed(3))}
                                            </Box> :
                                            <Skeleton variant={'text'} width={'120px'} height={'100%'} style={{ transform: 'unset' }} />
                                    }
                                    {
                                        data.userinfo ?
                                            <Box fontSize={'16px'}>
                                                {numberWithCommas(Number(data?.userinfo?.amount * lockinfo?.stakingTokenInfo.price).toFixed(2))} USD
                                            </Box> :
                                            <Box mt={'5px'}>
                                                <Skeleton variant={'text'} width={'60px'} height={'100%'} style={{ transform: 'unset' }} />
                                            </Box>
                                    }
                                </Box>
                                <Box>
                                    {
                                        (!data.userinfo || !data.userinfo.amount) ?
                                            <StyledButton onClick={() => { setModalOpen(2 + i); setModalBalance(lockinfo?.stakingTokenInfo.balance) }} disabled={pending}>
                                                Stake
                                            </StyledButton> :
                                            <Action>
                                                <StyledButton style={{ width: 'fit-content', padding: '0px 25px', fontSize: '32px', marginRight: '10px' }} onClick={() => { setModalOpen(2 + i); setModalBalance(lockinfo?.stakingTokenInfo.balance) }} disabled={pending}>
                                                    +
                                                </StyledButton>
                                                <StyledButton style={{ width: 'fit-content', padding: '0px 25px', fontSize: '32px', marginRight: '10px' }} onClick={() => { setModalOpen(12 + i); setModalBalance(data.userinfo.amount / 1) }} disabled={pending}>
                                                    -
                                                </StyledButton>
                                            </Action>
                                    }

                                </Box>
                            </Box>
                            :
                            <StyledButton style={{ width: '100%' }} onClick={() => onApproveContract(2, lockinfo?.stakingTokenInfo.address)} disabled={pending || !lockinfo?.stakingTokenInfo.address || !account}>
                                Enable Contract
                            </StyledButton>
                        }
                        <Box display={'flex'} justifyContent={'center'} pt={'10px'} mt={'10px'}>
                            <Box display={'flex'} alignItems={'center'} style={{ cursor: 'pointer' }} onClick={() => setShowLockDetail(showlockdetail === i ? -1 : i)}>
                                <Box mr={'20px'} fontSize={'21px'}>
                                    {showlockdetail === i ? 'Hide' : 'Details'}
                                </Box>
                                {showlockdetail === i ? <BsChevronUp /> : <BsChevronDown />}
                            </Box>
                        </Box>
                    </DataField>

                    {showlockdetail === i ? <Box mt={'20px'} fontSize={'18px'}>
                        <Box display={'flex'} justifyContent={'space-between'}>
                            <Box>Total Staked: </Box>
                            <Box>{numberWithCommas(Math.round(data?.lockup?.totalStaked / Math.pow(10, 18)).toString())}</Box>
                        </Box>
                        <Box display={'flex'} justifyContent={'space-between'}>
                            <Box>Ends in: </Box>
                            <Box>{numberWithCommas((lockinfo?.bonusEndBlock - data?.lockup?.lastRewardBlock).toString())}</Box>
                        </Box>
                        <Box display={'flex'} justifyContent={'end'}>
                            <a href={'https://pancakeswap.finance/info/token/0xaFb64E73dEf6fAa8B6Ef9a6fb7312d5C4C15ebDB'} target={'_blank'} style={{ textDecoration: 'none', color: 'white' }}>
                                See Token Info
                            </a>
                        </Box>
                    </Box> : ''
                    }
                </Paper>)}

                <Paper width={'600px'} height={'fit-content'} >
                    <Box display={'flex'} justifyContent={'space-between'} fontSize={'20px'}>
                        <Box>Staking Pool</Box>
                        <Box>Manual</Box>
                    </Box>
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} >
                        <Box>
                            <Box fontSize={'32px'}>
                                Earn GVR
                            </Box>
                            <Box fontSize={'21px'}>
                                Stake GVR
                            </Box>
                            <Box fontSize={'21px'}>
                                Reflection GVR
                            </Box>
                        </Box>
                        <Box >
                            <Box width={'40px'} height={'40px'} bgcolor={'white'} borderRadius={'50%'}>
                                <img src={'/images/gov.png'} width={'100%'} height={'100%'} alt={'bnb'} />
                            </Box>
                            <Box position={'relative'} mt={'-30px'} ml={'10px'} width={'60px'} height={'60px'} bgcolor={'white'} borderRadius={'50%'}>
                                <img src={'/images/gov.png'} width={'100%'} height={'100%'} alt={'gov'} />
                            </Box>
                        </Box>
                    </Box>
                    <DataField>
                        <Box mt={'20px'} fontSize={'24px'} fontWeight={'bold'} display={'flex'} justifyContent={'space-between'}>
                            <Box color={'lightgrey'}>
                                APR:
                            </Box>
                            {
                                unlockinfo ?
                                    <Box fontWeight={'bold'} display={'flex'} alignItems={'center'} style={{ cursor: 'pointer' }} onClick={() => setCalcModal(1)}>
                                        <Box>{Number(unlockinfo?.rate).toFixed(2)} % </Box>
                                        <Box ml={'5px'} mt={'8px'}>
                                            <img src='/images/operation.svg' alt='operation' />
                                        </Box>
                                    </Box> :
                                    <Skeleton variant={'text'} width={'120px'} height={'100%'} style={{ transform: 'unset' }} />
                            }
                        </Box>
                        <Box mt={'20px'} fontSize={'18px'} display={'flex'} justifyContent={'space-between'}>
                            <Box color={'lightgrey'}>
                                &nbsp;
                            </Box>
                            <Box fontWeight={'bold'}>
                                &nbsp;
                            </Box>
                        </Box>
                        <Box mt={'20px'} fontSize={'18px'} display={'flex'} justifyContent={'space-between'}>
                            <Box color={'lightgrey'}>
                                Deposit Fee:
                            </Box>
                            {
                                unlockinfo ?
                                    <Box fontWeight={'bold'}>
                                        {Number(unlockinfo?.depositFee / 100).toFixed(2)}%
                                    </Box> :
                                    <Skeleton variant={'text'} width={'60px'} height={'100%'} style={{ transform: 'unset' }} />
                            }
                        </Box>
                        <Box fontSize={'18px'} display={'flex'} justifyContent={'space-between'}>
                            <Box color={'lightgrey'}>
                                Withdraw Fee:
                            </Box>
                            {
                                unlockinfo ?
                                    <Box fontWeight={'bold'}>
                                        {Number(unlockinfo?.withdrawFee / 100).toFixed(2)}%
                                    </Box> :
                                    <Box mt={'5px'}>
                                        <Skeleton variant={'text'} width={'60px'} height={'100%'} style={{ transform: 'unset' }} />
                                    </Box>
                            }
                        </Box>

                        <Box mt={'20px'} fontSize={'18px'} display={'flex'} justifyContent={'space-between'}>
                            <Box color={'lightgrey'}>
                                GVR Earned
                            </Box>
                        </Box>
                        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} fontSize={'24px'}>
                            <Box mt={'10px'}>
                                {unlockinfo ?
                                    <Box fontWeight={'bold'} >
                                        {numberWithCommas(Number(unlockinfo?.pendingReward).toFixed(3))}
                                    </Box> :
                                    <Skeleton variant={'text'} width={'120px'} height={'100%'} style={{ transform: 'unset' }} />
                                }
                                {unlockinfo ?
                                    <Box fontSize={'16px'}>
                                        {numberWithCommas(Number(unlockinfo?.pendingReward * unlockinfo?.earnedTokenInfo.price).toFixed(2))} USD
                                    </Box> :
                                    <Box mt={'5px'}>
                                        <Skeleton variant={'text'} width={'60px'} height={'100%'} style={{ transform: 'unset' }} />
                                    </Box>
                                }
                            </Box>
                            <Box>
                                <Box>
                                    <StyledButton
                                        style={{ width: '100px', fontSize: '14px', padding: '5px' }}
                                        disabled={pending || !unlockinfo?.pendingReward}
                                        onClick={() => onCompoundReward(1)}
                                    >
                                        Compound
                                    </StyledButton>
                                </Box>
                                <Box mt={'5px'}>
                                    <StyledButton
                                        style={{ width: '100px', fontSize: '14px', padding: '5px' }}
                                        disabled={pending || !unlockinfo?.pendingReward}
                                        onClick={() => onHarvestReward(1)}
                                    >Harvest
                                    </StyledButton>
                                </Box>
                            </Box>
                        </Box>
                        <Box mt={'20px'} fontSize={'18px'} display={'flex'} justifyContent={'space-between'}>
                            <Box color={'lightgrey'}>
                                GVR Reflected
                            </Box>
                        </Box>
                        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} fontSize={'24px'}>
                            <Box>
                                {unlockinfo ?
                                    <Box fontWeight={'bold'} >
                                        {numberWithCommas(unlockinfo?.pendingReflection.toFixed(3))} &nbsp;
                                    </Box>
                                    :
                                    <Skeleton variant={'text'} width={'120px'} height={'100%'} style={{ transform: 'unset' }} />
                                }
                                {
                                    unlockinfo ?
                                        <Box fontSize={'16px'}>
                                            {numberWithCommas((unlockinfo?.pendingReflection * unlockinfo?.reflectionTokenInfo.price).toFixed(2))} USD
                                        </Box> :
                                        <Box mt={'5px'}>
                                            <Skeleton variant={'text'} width={'60px'} height={'100%'} style={{ transform: 'unset' }} />
                                        </Box>
                                }
                            </Box>
                            <Box>
                                <Box>
                                    <StyledButton
                                        style={{ width: '100px', fontSize: '14px', padding: '5px' }}
                                        disabled={pending || !unlockinfo?.pendingReflection}
                                        onClick={() => onCompoundReflection(1)}
                                    >
                                        Compound
                                    </StyledButton>
                                </Box>
                                <Box mt={'5px'}>
                                    <StyledButton
                                        style={{ width: '100px', fontSize: '14px', padding: '5px' }}
                                        disabled={pending || !unlockinfo?.pendingReflection}
                                        onClick={() => onHarvestReflection(1)}
                                    >Harvest
                                    </StyledButton>
                                </Box>
                            </Box>
                        </Box>
                        <Box mt={'20px'} fontSize={'18px'} display={'flex'} justifyContent={'space-between'}>
                            <Box color={'lightgrey'}>
                                GVR Staked
                            </Box>
                        </Box>
                        {unlockallow && account ?
                            <Box fontSize={'24px'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                <Box mt={'10px'}>
                                    {
                                        unlockinfo.userinfo ?
                                            <Box fontWeight={'bold'}>
                                                {numberWithCommas(Number(unlockinfo?.userinfo?.amount).toFixed(3))}
                                            </Box> :
                                            <Skeleton variant={'text'} width={'120px'} height={'100%'} style={{ transform: 'unset' }} />
                                    }
                                    {
                                        unlockinfo.userinfo ?
                                            <Box fontSize={'16px'}>
                                                {numberWithCommas(Number(unlockinfo?.userinfo?.amount * unlockinfo?.stakingTokenInfo.price).toFixed(2))} USD
                                            </Box> :
                                            <Box mt={'5px'}>
                                                <Skeleton variant={'text'} width={'60px'} height={'100%'} style={{ transform: 'unset' }} />
                                            </Box>
                                    }
                                </Box>
                                <Box>
                                    {
                                        !unlockinfo?.userinfo?.amount ?
                                            <StyledButton onClick={() => { setModalOpen(1); setModalBalance(unlockinfo?.stakingTokenInfo.balance) }} disabled={pending}>
                                                Stake
                                            </StyledButton> : ''
                                    }
                                    {
                                        unlockinfo?.userinfo?.amount ?
                                            <Action>
                                                <StyledButton style={{ width: 'fit-content', padding: '0px 25px', fontSize: '32px', marginRight: '10px' }} onClick={() => { setModalOpen(1); setModalBalance(unlockinfo?.stakingTokenInfo.balance) }} disabled={pending}>
                                                    +
                                                </StyledButton>
                                                <StyledButton style={{ width: 'fit-content', padding: '0px 25px', fontSize: '32px' }} onClick={() => { setModalOpen(11); setModalBalance(unlockinfo?.userinfo?.amount) }} disabled={pending}>
                                                    -
                                                </StyledButton>
                                            </Action> : ''
                                    }

                                </Box>
                            </Box>
                            :
                            <StyledButton style={{ width: '100%' }} onClick={() => onApproveContract(1, unlockinfo?.stakingTokenInfo.address)} disabled={pending || !unlockinfo?.stakingTokenInfo.address || !account}>
                                Enable Contract
                            </StyledButton>
                        }
                        <Box display={'flex'} justifyContent={'center'} pt={'10px'} mt={'10px'}>
                            <Box display={'flex'} alignItems={'center'} style={{ cursor: 'pointer' }} onClick={() => setShowUnlockDetail(!showunlockdetail)}>
                                <Box mr={'20px'} fontSize={'21px'}>
                                    {showunlockdetail ? 'Hide' : 'Details'}
                                </Box>
                                {showunlockdetail ? <BsChevronUp /> : <BsChevronDown />}
                            </Box>
                        </Box>
                    </DataField>
                    {showunlockdetail ? <Box mt={'20px'} fontSize={'18px'}>
                        <Box display={'flex'} justifyContent={'space-between'}>
                            <Box>Total Staked: </Box>
                            <Box>{numberWithCommas(Math.round(unlockinfo?.totalStaked / Math.pow(10, 18)).toString())}</Box>
                        </Box>
                        <Box display={'flex'} justifyContent={'space-between'}>
                            <Box>Ends in: </Box>
                            <Box>{numberWithCommas(unlockinfo?.endsIn)}</Box>
                        </Box>
                        <Box display={'flex'} justifyContent={'end'}>
                            <a href={'https://pancakeswap.finance/info/token/0xaFb64E73dEf6fAa8B6Ef9a6fb7312d5C4C15ebDB'} target={'_blank'} style={{ textDecoration: 'none', color: 'white' }}>
                                See Token Info
                            </a>
                        </Box>
                    </Box> : ''
                    }
                </Paper>
            </LockPanel >
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
                @media screen and (max-width : 2500px){
                    height : 1900px;
  }
                @media screen and (max-width : 1550px){
                    background-color : white;
                background-repeat : repeat-y;
                background-position : top;
                background-size : unset;
                height : unset;
  }
                @media screen and (max-width : 850px){
                    padding-left : 20px;
                padding-right : 20px;
  }
                `;
const Paper = styled(Box)`
                width : fit-content;
                box-shadow : 0 0px 20px 0 rgb(64 75 151), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                padding : 30px 50px;
                border-radius : 12px;
                background: rgb(23 34 108 / 60%);
                margin-bottom : 50px;
                margin-right : 50px;
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

const LockPanel = styled(Box)`
                margin-left : 50px;
                display : flex;
                flex-wrap : wrap;
                justify-content : center;
                @media screen and (max-width : 650px){
                    margin-left : 0px;
        >div{
                    margin-right : 0px;
        }
    }
                @media screen and (max-width : 450px){
        > div{
                    padding : 30px 20px;
        }
    }
                `;

const Action = styled(Box)`
                display : flex;
                @media screen and (max-width : 500px){
                    justify-content : end;
                flex-direction : column;
        >button{
                    margin-right : 0!important;
                margin-bottom : 10px;
        }
    }
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
    >div{
        @media screen and (max-width : 600px)
                {
                    font-size : 16px!important;
        }
    }
                `;
export default Pool;
