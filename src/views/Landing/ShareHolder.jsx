import React, { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Box, TextField } from "@material-ui/core";
import StyledButton from "../../components/StyledButton";
import { useMediaQuery } from "@material-ui/core";
import { useWeb3Context } from "src/hooks/web3Context";
import usePollShareVault from "src/state/shareholder/hooks";
import { useShareVaultData } from "src/state/hooks";
import useTokenAllowance from "src/hooks/useTokenAllowance";
import useTokenBalance from "src/hooks/useTokenBalance";
import { getSharedHoldersVaultAddress } from "src/utils/addressHelpers";
import {
  getFullDisplayBalance,
  getDecimalAmount,
  getBalanceNumber,
} from "src/utils/formatBalance";
import useShareVault from "./hooks";
import { useDispatch } from "react-redux";
import {
  fetchShareVaultPublicDataAsync,
  fetchShareVaultUserDataAsync,
} from "src/state/shareholder";

const ShareHolder = ({ curpage, setCurPage }) => {
  const { address: account } = useWeb3Context();
  const dispatch = useDispatch();

  const {
    token,
    rewardToken,
    totalStaked,
    prevTotal,
    allTimeRewards,
    availableRewards,
    lockDuration,
    performanceFee,
    emergencyWithdraw,
    userData,
  } = useShareVaultData();

  const balance = useTokenBalance(token.address, account);
  const { allowance, onApprove } = useTokenAllowance(
    token.address,
    getSharedHoldersVaultAddress()
  );
  const { onStake, onWithdraw, onHarvest } = useShareVault(performanceFee);

  const [amount, setAmount] = useState(0);
  const [pendingTx, setPendingTx] = useState(false);
  const [approving, setApproving] = useState(false);
  const [depositing, setDepositing] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [harvesting, setHarvesting] = useState(false);

  usePollShareVault();

  const handleMax = () => {
    setAmount(getBalanceNumber(balance));
  };

  const handleApprove = async () => {
    if (pendingTx) return;

    setPendingTx(true);
    setApproving(true);
    try {
      await onApprove();
      toast.success(`${token.symbol} was approved for share holder vault!`);
    } catch (e) {
      console.log(e);
      toast.error(e.data?.message ?? e.message.split("(")[0]);
    }

    setPendingTx(false);
    setApproving(false);
  };

  const handleDeposit = async () => {
    if (pendingTx) return;
    if (amount === "" || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amount > getBalanceNumber(balance)) {
      toast.error("You don't have enough tokens");
      return;
    }

    setPendingTx(true);
    setDepositing(true);
    try {
      await onStake(getDecimalAmount(amount, token.decimals).toJSON());
      toast.success(`${token.symbol} was deposited into share holder vault!`);

      dispatch(fetchShareVaultPublicDataAsync());
      dispatch(fetchShareVaultUserDataAsync(account));
    } catch (e) {
      console.log(e);
      toast.error(e.data?.message ?? e.message.split("(")[0]);
    }
    setPendingTx(false);
    setDepositing(false);
  };

  const handleHarvest = async () => {
    if(userData.rewards === '0') return
    if (pendingTx) return;

    setPendingTx(true);
    setHarvesting(true);
    try {
      await onHarvest();
      toast.success(`${rewardToken.symbol} was claimed!`);

      dispatch(fetchShareVaultPublicDataAsync());
      dispatch(fetchShareVaultUserDataAsync(account));
    } catch (e) {
      console.log(e);
      toast.error(e.data?.message ?? e.message.split("(")[0]);
    }

    setPendingTx(false);
    setHarvesting(false);
  };

  const handleWithdraw = async () => {
    if (pendingTx) return;
    // if(amount === '' || amount <= 0) {
    //     toastError("Error", "Please enter a valid amount");
    //     return
    // }
    // if(amount > getBalanceNumber(userData.staked)) {
    //     toast.error("You don't have enough tokens in vault");
    //     return
    // }
    if (
      userData.lastDepositedTime + lockDuration * 60 * 60 > Date.now() / 1000 &&
      !emergencyWithdraw
    ) {
      toast.error("You can't withdraw yet");
      return;
    }

    setPendingTx(true);
    setWithdrawing(true);
    try {
      // await onWithdraw(getDecimalAmount(amount, token.decimals).toJSON());
      await onWithdraw(userData.staked);
      toast.success(`${token.symbol} was withdrawn from share holder vault!`);

      dispatch(fetchShareVaultPublicDataAsync());
      dispatch(fetchShareVaultUserDataAsync(account));
    } catch (e) {
      console.log(e);
      toast.error(e.data?.message ?? e.message.split("(")[0]);
    }

    setPendingTx(false);
    setWithdrawing(false);
  };

  const sm = useMediaQuery("(max-width: 1440px)");
  const xs = useMediaQuery("(max-width: 750px");
  return (
    <>
      <Box
        fontSize={xs ? "29px" : "70px"}
        fontWeight={600}
        textAlign={"center"}
        lineHeight={xs ? "34px" : "83px"}
      >
        <span style={{ color: "#00E9C8" }}>Bloc</span>Vest Triple Vault
      </Box>
      <ShardHolders mt={xs ? "31px" : "65px"} active={curpage === 1}>
        <Box
          width={"455px"}
          position={"relative"}
          onClick={() => sm && (curpage === 1 ? setCurPage(0) : setCurPage(1))}
        >
          <Box
            fontSize={xs ? "24px" : "36px"}
            lineHeight={xs ? "41px" : "55px"}
            fontWeight={"700"}
            textAlign={xs && curpage !== 1 ? "center" : "left"}
          >
            Shareholders Vault
          </Box>
          <Box
            pt={xs ? "12px" : "18px"}
            fontWeight={"500"}
            lineHeight={xs ? "14px" : "19px"}
            pb={xs ? "40px" : "80px"}
            fontSize={xs ? "12px" : "16px"}
          >
            When you enter this vault your tokens will be locked for 6 months
            from the date you enter.
            <br /> <br />
            If you add to your tokens the lock will enter a new 6 month period.
            <br /> <br />
            Earn your share of the 50% allocation to this vault from all buy &
            sell tax.
          </Box>
          <Box
            color={"#00E9C8"}
            textAlign={"center"}
            position={"absolute"}
            width={xs ? "calc(100% - 62px)" : "calc(100% - 76px)"}
            fontWeight={"500"}
            top={xs ? "10px" : "16px"}
            fontSize={xs ? "16px" : "20px"}
            display={"none"}
          >
            VIEW
          </Box>
        </Box>
        <Box width={"503px"}>
          <InfoPanel>
            <Box color={"#131043"}>Wallet Address</Box>
            <Box fontWeight={600}>{account}</Box>
          </InfoPanel>
          <Box display={"flex"} alignItems={"center"} mt={"10px"}>
            <InfoPanel mr={"12px"}>
              <Box color={"#131043"}>Token Amount </Box>
              <Box fontWeight={600} fontSize={xs ? "15px" : "20px"}>
                <TextField
                  type="number"
                  value={amount}
                  inputProps={{
                    style: {
                      textAlign: "right",
                      color: "#fff",
                      fontSize: xs ? "15px" : "20px",
                      fontWeight: 600,
                    },
                    placeHolder: "0",
                  }}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Box>
            </InfoPanel>
            <StyledButton
              width={xs ? "46px" : "63px"}
              height={"33px"}
              onClick={handleMax}
            >
              MAX
            </StyledButton>
          </Box>
          <Box mt={"20px"} display={"flex"} justifyContent={"space-between"}>
            <StyledButton
              width={xs ? "98px" : "124px"}
              height={"33px"}
              disabled={pendingTx}
              onClick={
                allowance.gt(0) && allowance.gte(amount)
                  ? handleDeposit
                  : handleApprove
              }
            >
              {allowance.gt(0) && allowance.gte(amount)
                ? `${depositing ? "Entering..." : "ENTER VAULT"}`
                : `${approving ? "Approving..." : "APPROVE"}`}
            </StyledButton>
            <StyledButton
              width={xs ? "98px" : "124px"}
              height={"33px"}
              disabled={pendingTx}
              onClick={handleWithdraw}
            >
              {`${withdrawing ? "Withdrawing..." : "EXIT VAULT"}`}
            </StyledButton>
          </Box>
          <Box
            mt={xs ? "53px" : "127px"}
            borderTop={"2px solid #FFFFFF"}
            pt={"30px"}
          >
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={xs ? "end" : "center"}
              flexDirection={xs ? "column-reverse" : "row"}
            >
              <StyledButton
                type={"secondary"}
                width={xs ? "135px" : "184px"}
                height={"33px"}
                disabled={pendingTx || userData.rewards === '0'}
                onClick={handleHarvest}
              >
                {`${harvesting ? "Claiming..." : "CLAIM MY REWARDS"}`}
              </StyledButton>
              <Box
                ml={xs ? "0" : "14px"}
                padding={xs ? "10px" : "15px"}
                textAlign={"right"}
                bgcolor={"white"}
                borderRadius={"9px"}
                fontSize={xs ? "15px" : "20px"}
                fontWeight={600}
                width={xs ? "100%" : "210px"}
                color={"#131043"}
                mb={xs ? "10px" : "0"}
              >
                {getFullDisplayBalance(
                  userData.rewards,
                  rewardToken.decimals,
                  4
                )}
              </Box>
            </Box>
          </Box>
        </Box>
        <Box width={"397px"}>
          <Box
            fontSize={xs ? "15px" : "20px"}
            lineHeight={xs ? "35px" : "45px"}
            fontWeight={600}
          >
            MY SHARE
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            lineHeight={"13px"}
            mt={"12px"}
            color={"#96A7AF"}
            fontSize={xs ? "12px" : "16px"}
          >
            <Box>YOUR BVST TOTAL</Box>
            <Box>YOUR SHARE % </Box>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            fontSize={xs ? "15px" : "20px"}
            lineHeight={xs ? "18px" : "24px"}
            fontWeight={500}
          >
            <Box>
              {getFullDisplayBalance(userData.staked, token.decimals, 2)}
            </Box>
            <Box>
              {totalStaked === "0"
                ? "0.00"
                : ((+userData.staked * 100) / +totalStaked).toFixed(3)}
              %
            </Box>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            lineHeight={xs ? "14px" : "19px"}
            mt={"22px"}
            color={"#96A7AF"}
            fontSize={xs ? "12px" : "16px"}
          >
            <Box>NEXT BUSD SHARE</Box>
            <Box>TOTAL BUSD </Box>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            fontSize={xs ? "15px" : "20px"}
            lineHeight={xs ? "18px" : "24px"}
            fontWeight={500}
          >
            <Box>
              {getFullDisplayBalance(userData.rewards, rewardToken.decimals, 4)}
            </Box>
            <Box>
              {getFullDisplayBalance(userData.totalEarned, rewardToken.decimals, 2)}
            </Box>
          </Box>
          <Box
            mt={xs ? "30px" : "35px"}
            height={"2px"}
            bgcolor={"white"}
            width={"100%"}
          />
          <Box
            fontSize={xs ? "15px" : "20px"}
            lineHeight={xs ? "35px" : "45px"}
            fontWeight={600}
            mt={"13px"}
          >
            VAULT OVERVIEW
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            lineHeight={"13px"}
            mt={"16px"}
            color={"#96A7AF"}
            fontSize={xs ? "12px" : "16px"}
          >
            <Box>TOTAL BVST </Box>
            <Box>BUSD THIS PERIOD </Box>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            fontSize={xs ? "15px" : "20px"}
            lineHeight={xs ? "18px" : "24px"}
            fontWeight={500}
          >
            <Box>{getFullDisplayBalance(totalStaked, token.decimals, 2)}</Box>
            <Box>
              $
              {getFullDisplayBalance(availableRewards, rewardToken.decimals, 2)}
            </Box>
          </Box>
          <Box mt={"23px"} height={"2px"} bgcolor={"white"} width={"100%"} />
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            color={"#00D8BD"}
            mt={"24px"}
          >
            <Box
              width={"82px"}
              lineHeight={"16px"}
              fontSize={xs ? "12px" : "16px"}
            >
              BUSD
              <br /> ALL TIME
            </Box>
            <Box
              fontSize={xs ? "24px" : "36px"}
              fontWeight={500}
              lineHeight={"43px"}
            >
              ${getFullDisplayBalance(allTimeRewards, rewardToken.decimals, 2)}
            </Box>
          </Box>
        </Box>
      </ShardHolders>
    </>
  );
};

const ShardHolders = styled(Box)`
  display: flex;
  justify-content: space-between;
  height: 470px;
  > div {
    height: 100%;
    box-shadow: 0px 4px 7px rgba(0, 0, 0, 0.35);
    border-radius: 22px;
  }
  > div:nth-child(1) {
    background: #d7ddec;
    padding: 38px 48px;
    color: #131043;
  }
  > div:nth-child(2) {
    padding: 51px 48px 40px 48px;
    background: rgba(136, 144, 167, 0.84);
  }
  > div:nth-child(3) {
    padding: 40px 46px 40px 46px;
    background: #4d5772;
    color: white;
  }
  @media screen and (max-width: 1440px) {
    flex-direction: column;
    width: fit-content;
    margin: 0 auto;
    height: fit-content;
    width: 700px;
    > div {
      width: 100%;
      margin-bottom: ${({ active }) => (active ? "30px" : "0")};
      display: ${({ active }) => (active ? "block" : "none")};
    }
    > div:nth-child(1) {
      padding: 46px 48px;
      display: block;
      > div:nth-child(2) {
        display: ${({ active }) => (active ? "block" : "none")};
      }
      > div:nth-child(3) {
        display: ${({ active }) => (!active ? "block" : "none")};
      }
      cursor: pointer;
    }
  }
  @media screen and (max-width: 750px) {
    width: 300px;
    > div:nth-child(1) {
      padding: ${({ active }) => (active ? "27px 32px" : "32px")};
    }
    > div:nth-child(2) {
      padding: 30px 15px;
    }
    > div:nth-child(3) {
      padding: 18px 12px 25px 12px;
    }
  }
`;

const InfoPanel = styled(Box)`
  font-size: 16px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 9px;
  width: 100%;
  height: 52px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 14px;
  @media screen and (max-width: 750px) {
    font-size: 12px;
    height: 43px;
    padding: 0 8px;
  }
  & > div {
    white-space: nowrap;
    margin-right: 10px;

    &:last-child {
      margin-right: 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

export default ShareHolder;
