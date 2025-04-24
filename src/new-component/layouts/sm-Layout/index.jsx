import PropTypes from 'prop-types';

import Header from '../common/header-simple';
import { Box } from '@mui/material';
import Main from '../dashboard/main';
import SMMain from '../dashboard/sm-main';
import SMHeaderSimple from '../common/sm-header-simple';

// ----------------------------------------------------------------------

export default function SMSimpleLayout({ children }) {
  const pathname = window.location.pathname
  return (
    <>
      <SMHeaderSimple />
      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        {/* {renderNavVertical} */}

        <SMMain
          sx={{
            backgroundColor: 'background.bg1',
            overflow: 'hidden',
            // p:'auto'
            // p: (pathname === '/login' || pathname === '/register' || pathname === '/forgot-password' || pathname === '/reset-password') ? 0 : 'auto'
          }} >{children}</SMMain>
      </Box>
      {/* {children} */}
    </>
  );
}

SMSimpleLayout.propTypes = {
  children: PropTypes.node,
};
