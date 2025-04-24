import React from 'react';
import PropTypes from 'prop-types';
import Switch from '@mui/material/Switch';
import { keyframes, styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import SvgColor from 'src/components/svg-color';
import { color, m } from 'framer-motion';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;
const CustomSwitch1 = styled((props) => (
    <Switch
        focusVisibleClassName=".Mui-focusVisible"
        disableRipple
        {...props}
    />
))(({ theme, icons }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        ':hover': {
            backgroundColor: 'transparent',
        },
        '&.Mui-checked': {
            color: '#ffff',
            transform: 'translateX(22px)',
            ':hover': {
                backgroundColor: 'transparent',
            },
            '& .MuiSwitch-thumb:before': {
                content: '""',
                position: 'absolute',
                width: '100%',
                height: '100%',
                left: 0,
                top: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundImage: 'none',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        // backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
        width: 32,
        height: 32,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline',
        '&:before': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundImage: 'none',
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        // backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2,
    },
}));

const CustomSwitch = styled((props) => (
    <Switch
        focusVisibleClassName=".Mui-focusVisible"
        disableRipple
        {...props}
    />
))(({ theme, icons }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb': {
                backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
                '& .icon': {
                    animation: `${rotate} 0.5s`,
                },
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundImage: 'none',
                },
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
        width: 32,
        height: 32,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& .icon': {
            animation: `${rotate} 0.5s`,
        },
        '&:before': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundImage: 'none',
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2,
    },
}));

const BaseOptions = ({ icons, options, value, onChange }) => {
    const handleSwitchChange = (event) => {
        onChange(event.target.checked ? options[1] : options[0]);
    };

    return (
        <Stack direction="row" spacing={2}>
                <CustomSwitch1
                    checked={value === options[1]}
                    onChange={handleSwitchChange}
                    icons={[
                        `/assets/icons/setting/ic_${icons[0]}.svg`,
                        `/assets/icons/setting/ic_${icons[1]}.svg`,
                    ]}
                    icon={
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                            <SvgColor src={`/assets/icons/setting/ic_${icons[0]}.svg`} sx={{ mt: 1, width: '17px', height: '17px' }} component={m.div}
                                animate={{
                                    rotate: [0, 360],
                                }}
                                transition={{
                                    duration: 12,
                                    ease: 'linear',
                                    repeat: Infinity,
                                }} />
                        </div>
                    }
                    checkedIcon={
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                            <SvgColor src={`/assets/icons/setting/ic_${icons[1]}.svg`} sx={{ mt: 1, width: '16px', height: '16px', ml: 1 }} />
                        </div>
                    }
                />
        </Stack>
    );
};

BaseOptions.propTypes = {
    icons: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    value: PropTypes.string.isRequired,
};

export default BaseOptions;
