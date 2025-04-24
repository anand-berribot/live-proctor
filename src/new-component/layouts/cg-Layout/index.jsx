import PropTypes from 'prop-types';

import { alpha, Box, useTheme } from '@mui/material';
import CGHeaderSimple from './cg-header-simple';
import CGMain from './cg-main';
import { bgGradient } from 'src/theme/css';

// ----------------------------------------------------------------------

export default function CGSimpleLayout({ children }) {

  const theme=useTheme()
  const pathname = window.location.pathname
  return (
    <>
      <CGHeaderSimple />
      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        {/* {renderNavVertical} */}

        <CGMain
          sx={{
            // backgroundColor: 'background.bg1',
            ...bgGradient({
              color: alpha(theme.palette.background.default, 0.9),
              imgUrl: '/assets/background/overlay_4.jpg',
            }),
            overflow: 'hidden',
            // p:'auto'
            // p: (pathname === '/login' || pathname === '/register' || pathname === '/forgot-password' || pathname === '/reset-password') ? 0 : 'auto'
          }} >{children}</CGMain>
      </Box>
      {/* {children} */}
    </>
  );
}

CGSimpleLayout.propTypes = {
  children: PropTypes.node,
};
