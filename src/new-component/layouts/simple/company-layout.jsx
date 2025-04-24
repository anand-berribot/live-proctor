import PropTypes from 'prop-types';

import Header from '../common/header-simple';
import { Box } from '@mui/material';
import Main from '../dashboard/main';
import CompanyHeaderSimple from '../common/company-header-simple';

// ----------------------------------------------------------------------

export default function CompanyLayout({ children }) {
  const pathname = window.location.pathname
  return (
    <>
      {/* <Header /> */}
      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        {/* {renderNavVertical} */}

        <Main
          sx={{
            p: (pathname === '/login' || pathname === '/verify-2fa' || pathname === '/register' || pathname === '/forgot-password' || pathname === '/reset-password'|| pathname === '/') ? 0 : 'auto'
          }} >{children}</Main>
        <CompanyHeaderSimple />
      </Box>
      {/* {children} */}
    </>
  );
}

CompanyLayout.propTypes = {
  children: PropTypes.node,
};
