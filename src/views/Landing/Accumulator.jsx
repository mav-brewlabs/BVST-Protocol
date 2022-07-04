import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@material-ui/core";
import { useMediaQuery } from "@material-ui/core";
import { useWeb3Context } from "src/hooks/web3Context";
import StyledButton from "../../components/StyledButton";

const Accumulator = ({ curpage, setCurPage }) => {
  const { address: account } = useWeb3Context();

  const [amount, setAmount] = useState("0");
  const [frequnecy, setFrequency] = useState("0");

  const sm = useMediaQuery("(max-width: 1440px)");
  const xs = useMediaQuery("(max-width: 750px");
  return (
    <>
      <ShardHolders active={curpage === 2}>
        <Box
          width={"455px"}
          position={"relative"}
          onClick={() => sm && (curpage === 2 ? setCurPage(0) : setCurPage(2))}
        >
          <Box
            fontSize={xs ? "24px" : "36px"}
            lineHeight={xs ? "31px" : "55px"}
            fontWeight={"700"}
            textAlign={xs && curpage !== 2 ? "center" : "left"}
          >
            Accumulator Vault
          </Box>
          <Box
            pt={"18px"}
            lineHeight={xs ? "14px" : "19px"}
            fontSize={xs ? "12px" : "16px"}
          >
            <Box pr={xs ? "10px" : "28px"}>
              The 5/1 Accumulator Vault is a unique way to earn 20% for
              depositing tokens weekly bi-weekly or monthly.
              <br />
              <br />
              Set your frequnecy, Then amount you wish to add. Each time you add
              that amount ontime you will recieve 20% reward for doing so.
              <br />
              <br />
            </Box>
            <Box pr={xs ? "10px" : "0"}>
              If you miss a deposit you will only be able to withdraw your
              previous deposit x the reward.
              <br />
              <br />
              This Vault is not tracked by token price deposited tokens earn 20%
              but remain at the dollar value entered + the reward for as long as
              you keep up deposits.
            </Box>
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
            <Box display={"flex"}>
              <Box color={"#131043"}>Frequency</Box>
              <Box
                color={"#131043"}
                fontSize={xs ? "8px" : "10px"}
                fontWeight={"300"}
                mt={xs ? "3px" : "8px"}
                ml={"5px"}
              >
                (WEEKLY/BI-WEEKLY/MONTHLY)
              </Box>
            </Box>
            <Box fontWeight={600} fontSize={xs ? "15px" : "20px"}>
              <Select
                value={frequnecy}
                onChange={(e) => setFrequency(e.target.value)}
              >
                <MenuItem value={0}>WEEKLY</MenuItem>
                <MenuItem value={1}>BI-WEEKLY</MenuItem>
                <MenuItem value={2}>MONTHLY</MenuItem>
              </Select>
            </Box>
          </InfoPanel>
          <InfoPanel mt={"10px"}>
            <Box display={"flex"}>
              <Box color={"#131043"}>Dep Amount</Box>
              <Box
                color={"#131043"}
                fontSize={xs ? "8px" : "10px"}
                fontWeight={"300"}
                mt={xs ? "3px" : "8px"}
                ml={"5px"}
              >
                (DOLLAR VALUE)
              </Box>
            </Box>
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
          <InfoPanel mt={"10px"}>
            <Box color={"#131043"}>Wallet Address</Box>
            <Box fontWeight={600}>{account}</Box>
          </InfoPanel>
          <Box mt={"20px"} display={"flex"} justifyContent={"space-between"}>
            <StyledButton width={"124px"} height={"33px"}>
              ENTER VAULT
            </StyledButton>
            <StyledButton width={"109px"} height={"33px"}>
              EXIT VAULT
            </StyledButton>
          </Box>
          <Box
            mt={xs ? "24px" : "55px"}
            borderTop={"2px solid #FFFFFF"}
            pt={xs ? "24px" : "30px"}
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
              >
                CLAIM MY REWARDS
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
                $160.00
              </Box>
            </Box>
          </Box>
        </Box>
        <Box width={"397px"}>
          <Box
            fontSize={"20px"}
            lineHeight={xs ? "33px" : "45px"}
            fontWeight={600}
          >
            MY REWARDS
          </Box>
          <Box
            mt={xs ? "20px" : "31px"}
            width={"100%"}
            height={"2px"}
            bgcolor={"white"}
          />
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            mt={xs ? "15px" : "20px"}
          >
            <Box lineHeight={xs ? "10px" : "13px"}>NEXT INST.</Box>
            <Box
              fontSize={xs ? "24px" : "36px"}
              fontWeight={500}
              lineHeight={"24px"}
              mt={xs ? "0" : "5px"}
            >
              24h / 35m
            </Box>
          </Box>
          <Box
            mt={xs ? "33px" : "41px"}
            width={"100%"}
            height={"2px"}
            bgcolor={"white"}
          />
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            mt={xs ? "15px" : "20px"}
          >
            <Box lineHeight={xs ? "10px" : "13px"}>VAULT BAL.</Box>
            <Box
              fontSize={xs ? "24px" : "36px"}
              fontWeight={500}
              lineHeight={"24px"}
              mt={xs ? "0" : "5px"}
            >
              $2,400.00
            </Box>
          </Box>
          <Box
            mt={xs ? "33px" : "41px"}
            width={"100%"}
            height={"2px"}
            bgcolor={"white"}
          />
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            mt={xs ? "15px" : "20px"}
            color={"#00D8BD"}
          >
            <Box lineHeight={xs ? "10px" : "13px"}>REWARD</Box>
            <Box
              fontSize={xs ? "24px" : "36px"}
              fontWeight={500}
              lineHeight={"24px"}
              mt={xs ? "0" : "5px"}
            >
              $160
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
    background: #043cb4;
    padding: 46px 64px 40px 48px;
    color: white;
  }
  > div:nth-child(2) {
    padding: 59px 48px 40px 48px;
    background: #4e75c8eb;
  }
  > div:nth-child(3) {
    padding: 45px 47px 40px 46px;
    background: #193c89eb;
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
      padding: ${({ active }) => (active ? "27px 32px 50px 32px" : "32px")};
    }
    > div:nth-child(2) {
      padding: 30px 15px;
    }
    > div:nth-child(3) {
      padding: 23px 15px 35px 15px;
      > div {
        font-size: 15px;
      }
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

export default Accumulator;
