import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Box, TextField } from "@material-ui/core";
import StyledButton from "../../components/StyledButton";
import { useMediaQuery } from "@material-ui/core";
import { useWeb3Context } from "src/hooks/web3Context";

const Trickle = ({ curpage, setCurPage }) => {
  const { address: account } = useWeb3Context();

  const [amount, setAmount] = useState("0");

  const sm = useMediaQuery("(max-width: 1440px)");
  const xs = useMediaQuery("(max-width: 750px");
  return (
    <>
      <ShardHolders active={curpage === 3}>
        <Box
          width={"455px"}
          position={"relative"}
          onClick={() => sm && (curpage === 3 ? setCurPage(0) : setCurPage(3))}
        >
          <Box
            fontSize={xs ? "24px" : "36px"}
            lineHeight={xs ? "41px" : "55px"}
            fontWeight={"700"}
            textAlign={xs && curpage !== 3 ? "center" : "left"}
          >
            Trickle Vault
          </Box>
          <Box
            pt={xs ? "7px" : "18px"}
            lineHeight={xs ? "14px" : "19px"}
            fontSize={xs ? "12px" : "16px"}
          >
            <Box>
              Welcome to our Triclke Vault. When you deposit your tokens into
              this vault you forfit them to the contract. In return you have 365
              claims.
              <br />
              <br />
              The claim level is tiered from basic to <br />
              platinum depending on which nft you hold. This is determined below
              when you connect your wallet.
              <br />
              <br />
              Once you reach your max claim allowance you will have o start a
              new wallet to avail of the rewards from this vault.
              <br />
              <br />
              Please note that this is a high reward compounding vault and best
              practise here is to compound daily.
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
            <Box color={"#131043"}>Wallet Address</Box>
            <Box fontWeight={600}>{account}</Box>
          </InfoPanel>
          <Box display={"flex"} alignItems={"center"} mt={xs ? "14px" : "10px"}>
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
            <StyledButton width={xs ? "46px" : "63px"} height={"33px"}>
              MAX
            </StyledButton>
          </Box>
          <InfoPanel border={"2px solid #FFFFFF"} mt={xs ? "14px" : "10px"}>
            <Box color={"#131043"}>NFT Boost</Box>
            <Box fontWeight={600} fontSize={xs ? "15px" : "20px"}>
              xxx
            </Box>
          </InfoPanel>
          <Box
            mt={xs ? "13px" : "20px"}
            display={"flex"}
            justifyContent={"space-between"}
          >
            <StyledButton width={xs ? "98px" : "124px"} height={"33px"}>
              ENTER VAULT
            </StyledButton>
          </Box>
          <Box
            mt={xs ? "21px" : "55px"}
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
              >
                COMPOUND
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
                2,500.00
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
            mt={xs ? "14px" : "25px"}
            width={"100%"}
            height={"2px"}
            bgcolor={"white"}
          />
          <Box display={"flex"} justifyContent={"space-between"} mt={"20px"}>
            <Box lineHeight={"13px"}>MY TOKENS</Box>
            <Box
              fontSize={xs ? "24px" : "36px"}
              fontWeight={500}
              lineHeight={xs ? "18px" : "24px"}
              mt={xs ? 0 : "5px"}
            >
              XXXX
            </Box>
          </Box>
          <Box
            mt={xs ? "26px" : "32px"}
            width={"100%"}
            height={"2px"}
            bgcolor={"white"}
          />
          <Box display={"flex"} justifyContent={"space-between"} mt={"20px"}>
            <Box lineHeight={"13px"}>TOTAL REW.</Box>
            <Box
              fontSize={xs ? "24px" : "36px"}
              fontWeight={500}
              lineHeight={xs ? "18px" : "24px"}
              mt={xs ? 0 : "5px"}
            >
              XXXX
            </Box>
          </Box>
          <Box
            mt={xs ? "26px" : "32px"}
            width={"100%"}
            height={"2px"}
            bgcolor={"white"}
          />
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            mt={"24px"}
            color={"#00D8BD"}
          >
            <Box lineHeight={"13px"}>VAULT TOTAL</Box>
            <Box
              fontSize={xs ? "24px" : "36px"}
              fontWeight={500}
              lineHeight={xs ? "18px" : "24px"}
              mt={xs ? 0 : "5px"}
            >
              XXXX
            </Box>
          </Box>
          <Box
            mt={xs ? "21px" : "37px"}
            borderTop={!sm ? "none" : "2px solid #FFFFFF"}
            pt={!sm ? "0" : "30px"}
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
                CLAIM
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
                365
              </Box>
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
    background: #2595bb;
    padding: 46px 56px 40px 48px;
    color: white;
  }
  > div:nth-child(2) {
    padding: 59px 48px 40px 48px;
    background: #61aec8d6;
  }
  > div:nth-child(3) {
    padding: 45px 47px 40px 46px;
    background: #1c6f8bd4;
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
      padding: ${({ active }) => (active ? "17px 46px 40px 32px" : "32px")};
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
export default Trickle;
