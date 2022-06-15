import { Box } from '@material-ui/core'
import { useState, useEffect } from 'react';
import { useMediaQuery } from '@material-ui/core'

let prevtimer = null;
export default function Swap({ date, setCurTime }) {
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [text, setText] = useState('Auction not Started');

    const sm = useMediaQuery("(min-width: 600px)");

    useEffect(() => {
        prevtimer && clearInterval(prevtimer);
        prevtimer = setInterval(function () {
            let temp = Math.floor(Math.max(date - Date.now(), 0) / 1000);
            setCurTime(temp);
            if (temp === 0) {
                setText('Auction Ended');
            }
            else if (temp > 3600) {
                temp -= 3600;
                setText('Auction will start in');
            }
            else
                setText('Auction ending in')

            setSeconds(temp % 60);
            setMinutes(Math.floor(temp / 60) % 60);
            setHours(Math.floor(temp / 3600) % 24);
            setDays(Math.floor(temp / 3600 / 24));
        }, 1000);
    }, [date]);
    return (
        <>
            <Box fontFamily='Rubik' fontSize={sm ? '1.2vw' : '4vw'} fontWeight={500} marginTop={sm ? '3vw' : '7vw'} lineHeight={'normal'}>
                {text}
            </Box>
            <Box display='flex' alignItems='center' justifyContent='space-between' width={sm ? '20vw' : '70vw'} marginX='auto'>
                <Box display='flex' flexDirection='column'>
                    <Box fontFamily='Comic Runes' fontSize={sm ? '3vw' : '15vw'} lineHeight={2}>{hours}</Box>
                    <Box fontFamily='Rubik' fontSize={sm ? '1.2vw' : '4vw'} textAlign='left' fontWeight={500} lineHeight={'normal'}>HOURS</Box>
                </Box>
                <Box display='flex' flexDirection='column'>
                    <Box fontFamily='Comic Runes' fontSize={sm ? '3vw' : '15vw'} lineHeight={2}>{minutes}</Box>
                    <Box fontFamily='Rubik' fontSize={sm ? '1.2vw' : '4vw'} textAlign='left' fontWeight={500} lineHeight={'normal'}>MINTS</Box>
                </Box>
                <Box display='flex' flexDirection='column'>
                    <Box fontFamily='Comic Runes' fontSize={sm ? '3vw' : '15vw'} lineHeight={2}>{seconds}</Box>
                    <Box fontFamily='Rubik' fontSize={sm ? '1.2vw' : '4vw'} textAlign='left' fontWeight={500} lineHeight={'normal'}>SECONDs</Box>
                </Box>
            </Box>
        </>
    )
}
