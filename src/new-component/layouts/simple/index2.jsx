import PropTypes from 'prop-types';

import Header from '../common/header-simple';
import { Box } from '@mui/material';
import Main from '../dashboard/main';

// ----------------------------------------------------------------------

export default function SimpleLayout({ children }) {
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
                        p: (pathname === '/login' || pathname === '/register' || pathname === '/forgot-password' || pathname === '/reset-password') ? 0 : 0
                        // 'auto'
                    }} >{children}</Main>
                <Header />
            </Box>
            {/* {children} */}
        </>
    );
}

SimpleLayout.propTypes = {
    children: PropTypes.node,
};
