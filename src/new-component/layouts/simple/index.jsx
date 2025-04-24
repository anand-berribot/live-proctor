import PropTypes from 'prop-types';

import Header from '../common/header-simple';
import { Box } from '@mui/material';
import Main from '../dashboard/main';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

export default function SimpleLayout({ children }) {
  const pathname = window.location.pathname;

  useEffect(() => {
    // Disable Right-Click
    const handleContextMenu = (event) => {
        event.preventDefault();
    };

    // Disable Keyboard Shortcuts
    const handleKeyDown = (event) => {
        if (
            (event.ctrlKey && event.shiftKey && event.key === 'I') ||  // Ctrl + Shift + I
            (event.ctrlKey && event.key === 'U') ||                    // Ctrl + U
            (event.key === 'F12') ||                                   // F12
            (event.ctrlKey && event.shiftKey && event.key === 'J') ||  // Ctrl + Shift + J
            (event.metaKey && event.altKey && event.key === 'I')       // Cmd + Option + I (Mac)
        ) {
            event.preventDefault();
            alert('Inspecting is disabled.');
        }
    };

    // Add Event Listeners
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup Listeners on Component Unmount
    return () => {
        window.removeEventListener('contextmenu', handleContextMenu);
        window.removeEventListener('keydown', handleKeyDown);
    };
}, []);

  return (
    <>
      {/* <Header /> */}
      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
        onContextMenu={(event) => event.preventDefault()}
      >
        {/* {renderNavVertical} */}

        <Main
          sx={{
            p: (pathname === '/login' || pathname === '/register' || pathname === '/forgot-password' || pathname === '/reset-password'|| pathname === '/') ? 0 : 'auto'
          }} 
          onContextMenu={(event) => event.preventDefault()}
          >{children}</Main>
        <Header />
      </Box>
      {/* {children} */}
    </>
  );
}

SimpleLayout.propTypes = {
  children: PropTypes.node,
};
