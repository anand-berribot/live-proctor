import { memo } from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { bgBlur } from 'src/theme/css';

import Scrollbar from 'src/components/scrollbar';
import { NavSectionHorizontal } from 'src/components/nav-section';

import { HEADER } from '../config-layout';
import { useNavData, useNavData1 } from './config-navigation';
import HeaderShadow from '../common/header-shadow';

// ----------------------------------------------------------------------

function NavHorizontal() {
  const theme = useTheme();

  const { user } = useMockedUser();

  const navData = useNavData();
  const navData1 = useNavData1();
  const currentYear = new Date().getFullYear();

  return (
    <AppBar
      component="div"
      sx={{
        top: HEADER.H_DESKTOP_OFFSET,
      }}
    >
      <Toolbar
        sx={{
          ...bgBlur({
            color: theme.palette.background.default,
          }),
        }}
      >
        <Scrollbar
          sx={{
            '& .simplebar-content': {
              display: 'flex',
            },
          }}
        >
          <NavSectionHorizontal
            data={navData1}
            // slotProps={{
            //   currentRole: user?.role,
            // }}
            sx={{
              ...theme.mixins.toolbar,
            }}
          />
          <Box sx={{ display: 'flex' , flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
            <Typography variant='caption' sx={{}}>Copyright © {currentYear}, BERRIBOT.</Typography>
            <Typography variant='caption' sx={{}}> All rights reserved.</Typography>
          </Box>
        </Scrollbar>
      </Toolbar>

      <HeaderShadow />
    </AppBar>
  );
}

export default memo(NavHorizontal);
