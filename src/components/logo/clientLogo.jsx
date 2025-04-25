import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import { useSettingsContext } from '../settings';
import { useCandidateExpContext } from 'src/context/candidate-exp-context/candidateExpContext';

import darkLogo from '/assets/proctor/berri_proctor_dark.svg';
import lightLogo from '/assets/proctor/berri_proctor_light.svg';

const Logo = forwardRef(({ mini, disabledLink = false, sx, ...other }, ref) => {
    const theme = useTheme();
    const settings = useSettingsContext();
    const { clientLogo = null } = useCandidateExpContext();

    const path = settings.themeMode === 'light' ? lightLogo : darkLogo;
    const logoIconSmall = settings.themeMode === 'light' ? '/favicon/berri.svg' : '/assets/new-icon/berri-icon-small.svg';

    // Vertical separator component
    const Separator = ({ mini }) => (
        <Box
            sx={{
                height: mini ? 24 : 40,
                borderLeft: `1px solid ${theme.palette.text.primary}`,
                mx: 2,
                alignSelf: 'center'
            }}
        />
    );

    // Main logo
    const mainLogo = (
        <Box
            component="img"
            src={mini ? logoIconSmall : path}
            sx={{ 
                width: { xs: 80, sm: 120, md: mini ? 35 : 190 }, 
                height: 'auto',
                cursor: 'pointer',
                display: 'inline-flex',
                ...sx 
            }}
            {...other}
        />
    );

    // Client logo (if it exists)
    const clientLogoComponent = clientLogo ? (
        <Box
            component="img"
            src={clientLogo}
            sx={{ 
                width: { xs: '50%', sm: '30%', md: mini ? '35%' : '20%' }, 
                height: 'auto',
                cursor: 'pointer',
                display: 'inline-flex',
                ...sx 
            }}
            {...other}
        />
    ) : null;

    // Combined logo with separator
    const logo = (
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: { xs: 'row', sm: 'row' } }}> 
            {mainLogo}
            {clientLogo && (
                <>
                    <Separator mini={mini} />
                    {clientLogoComponent}
                </>
            )}
        </Box>
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

Logo.propTypes = {
    disabledLink: PropTypes.bool,
    mini: PropTypes.bool,
    sx: PropTypes.object,
};

export default Logo;
