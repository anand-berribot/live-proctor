import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import { useSettingsContext } from '../settings';

import darkLogo from '/assets/proctor/berri_proctor_dark.svg';
import lightLogo from '/assets/proctor/berri_proctor_light.svg';

const ClientLogo = forwardRef(({ mini, disabledLink = false, sx, ...other }, ref) => {
    const theme = useTheme();
    const settings = useSettingsContext();
    const path = settings.themeMode === 'light' ? lightLogo : darkLogo;
    const logoIconSmall = settings.themeMode === 'light' ? '/favicon/berri.svg' : '/assets/new-icon/berri-icon-small.svg';

    // Main logo
    const mainLogo = (
        <Box
            component="img"
            src={mini ? logoIconSmall : path}
            sx={{ width: mini ? 35 : 190, cursor: 'pointer', display: 'inline-flex', ...sx }}
            {...other}
        />
    );


    // Combined logo (main logo + client logo if it exists)
    const logo = (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {mainLogo} 
        </div>
    );

    if (disabledLink) {
        return logo;
    }

    return (
        <Link href="/instructions" sx={{ display: 'contents' }}>
            {logo}
        </Link>
    );
});

ClientLogo.propTypes = {
    disabledLink: PropTypes.bool,
    sx: PropTypes.object,
};

export default ClientLogo;