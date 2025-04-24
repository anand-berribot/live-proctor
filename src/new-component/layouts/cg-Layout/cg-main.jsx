import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import { useResponsive } from 'src/hooks/use-responsive';

import { useSettingsContext } from 'src/components/settings';

import { NAV, HEADER } from '../config-layout';

// ----------------------------------------------------------------------

const SPACING = 8;

export default function CGMain({ children, sx, ...other }) {
  const settings = useSettingsContext();

  const lgUp = useResponsive('up', 'lg');

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  const isNavMini = settings.themeLayout === 'mini';

  if (isNavHorizontal) {
    return (
      <Box
        component="main"
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: 'column',
          pt: `${HEADER.H_MOBILE + 24}px`,
          pb: `${SPACING}px`,
          ...(lgUp && {
            pt: `${HEADER.H_MOBILE * 2 + 40}px`,
            pb: `${SPACING}px`,
          }),
          // backgroundColor: 'background.bg1',
        }}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        minHeight: 1,
        display: 'flex',
        flexDirection: 'column',
        // py: `${HEADER.H_MOBILE + SPACING}px`,
        // pt: `${HEADER.H_MOBILE + SPACING}px`,
        // pb: `${SPACING}px`,
        py: `${HEADER.H_MOBILE }px`,
        pt: `${HEADER.H_MOBILE }px`,
        ...(lgUp && {
          // px: 2,
          // py: `${HEADER.H_DESKTOP + SPACING}px`,
          // pt: `${HEADER.H_MOBILE + SPACING}px`,
          // pb: `${SPACING}px`,
          py: `${HEADER.H_DESKTOP}px`,
          pt: `${HEADER.H_MOBILE}px`,
          width: `calc(100% - ${NAV.W_VERTICAL}px)`,
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI}px)`,
          }),
        }),
        // backgroundColor: 'background.bg1',
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}

CGMain.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
};
