import { styled } from '@mui/system';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { forwardRef } from 'react';


// const Scrollbar = styled(Box)(({ theme }) => ({
//     overflowY: 'auto',
//     '&::-webkit-scrollbar': {
//         width: '8px',
//     },
//     '&::-webkit-scrollbar-track': {
//         background: 'transparent',
//     },
//     '&:hover::-webkit-scrollbar-track': {
//         // background: '#f1f1f1', // Color of the track on hover
//         background: 'transparent', // Color of the track on hover
//     },
//     '&::-webkit-scrollbar-thumb': {
//         backgroundColor: 'primary',
//         // backgroundColor: theme.palette.scroll.thumb,
//         borderRadius: '10px',
//         border: '2px solid transparent', // Add padding around the thumb
//         backgroundClip: 'content-box', // Show the padding as a gap around the thumb
//     },
//     '&::-webkit-scrollbar-thumb:hover': {
//         backgroundColor: 'primary',
//         // backgroundColor: theme.palette.scroll.active,
//         opacity: 0.8,
//     },
//     '&::-webkit-scrollbar-corner': {
//         background: 'transparent',
//     },
// }));

const CustomScrollbar = forwardRef(({ children, sx, ...other }, ref) => {
    const theme = useTheme();
    return (
        <Box
            ref={ref}
            {...other}
            sx={{
                ...sx,
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                    width: '10px',
                    height: '10px',
                },
                '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                },
                '&:hover::-webkit-scrollbar-track': {
                    // background: '#f1f1f1', // Color of the track on hover
                    background: 'transparent', // Color of the track on hover
                },
                '&::-webkit-scrollbar-thumb': {
                    // backgroundColor: 'primary',
                    backgroundColor: theme.palette.scroll.thumb,
                    borderRadius: '10px',
                    border: '2px solid transparent', // Add padding around the thumb
                    backgroundClip: 'content-box', // Show the padding as a gap around the thumb
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    // backgroundColor: 'primary',
                    backgroundColor: theme.palette.scroll.active,
                    opacity: 0.8,
                },
                '&::-webkit-scrollbar-corner': {
                    background: 'transparent',
                },
            }}>
            {children}
        </Box>
    );
});
export default CustomScrollbar;