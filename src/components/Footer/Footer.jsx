import { Box } from '@material-ui/core'
import "../../assets/style/home.css"
import FooterBg from "../../assets/img/footer-bg.png"
import IconFirst from "../../assets/img/hali-icon-1.png"
import { useMediaQuery } from '@material-ui/core'
import styled from 'styled-components'

export default function Footer() {
  const sm = useMediaQuery("(min-width: 600px)");
  return (
    <StyledContainer>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} pt={'25px'} fontSize={'16px'} fontWeight={500} color={'white'}>
        <Box >DESIGN BY: BlocVault Media. </Box>
        <Box>Copyright 2022</Box>
      </Box>
    </StyledContainer>
  )
}

const StyledContainer = styled(Box)`
width : 100%;
height : 80px;
  >div{
    width : 100%;
    max-width : 1400px;
    margin : 0 auto;
  }
  @media screen and (max-width : 1440px){
    display : none;
  }
`;
