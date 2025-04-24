import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';
import { useSettingsContext } from '../settings';

import berri_cog_dark from 'src/assets/icons/berri/berri_cog_dark.svg'
import berri_cog_light from 'src/assets/icons/berri/berri_cog_light.svg'
import dark_logo from 'src/assets/icons/berri/dark_logo.svg'
import light_logo from 'src/assets/icons/berri/light_logo.svg'
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

const SMLogo = forwardRef(({ mini, disabledLink = false, sx, ...other }, ref) => {
  const theme = useTheme();
  const settings = useSettingsContext();
  const router = useRouter()

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  const path = settings.themeMode === 'light' ? '/assets/new-icon/sm/Berri_search&match1.svg' : '/assets/new-icon/sm/logo-dark.svg'
  // console.log('Logo', mini)

  // OR using local (public folder)
  // -------------------------------------------------------
  const logo = (
    <Box
      component="img"
      src={path}
      sx={{ width: 260, cursor: 'pointer', display: 'inline-flex', ...sx }} {...other}
    />
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link
      target="_blank" rel="noopener noreferrer" onClick={() => router.push('/sm/search')}
    // component={RouterLink} href="/" sx={{ display: 'contents' }}
    >
      <div>
        {logo}</div>
    </Link>
  );
});

SMLogo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default SMLogo;
