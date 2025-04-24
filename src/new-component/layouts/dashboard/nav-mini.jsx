import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { hideScroll } from 'src/theme/css';

import Logo from 'src/components/logo';
import { NavSectionMini } from 'src/components/nav-section';

import { NAV } from '../config-layout';
import { useNavData, useNavData1 } from './config-navigation';
import NavToggleButton from '../common/nav-toggle-button';
import { Typography } from '@mui/material';

// ----------------------------------------------------------------------

export default function NavMini() {
  const { user } = useMockedUser();

  const navData = useNavData();
  const navData1 = useNavData1();
  const currentYear = new Date().getFullYear();


  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_MINI },
      }}
    >
      <NavToggleButton
        sx={{
          top: 22,
          left: NAV.W_MINI - 12,
        }}
      />

      <Stack
        sx={{
          pb: 2,
          height: 1,
          position: 'fixed',
          width: NAV.W_MINI,
          borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          ...hideScroll.x,
        }}
      >
        <Logo
          sx={{
            // mx:'auto',
            ml: 3, my: 3
          }}
          mini />

        <NavSectionMini
          data={navData1}
        // slotProps={{
        //   currentRole: user?.role,
        // }}
        />
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <Typography variant='caption' sx={{fontSize:'0.6rem'}}>Copyright © {currentYear},</Typography>
          <Typography variant='caption' sx={{fontSize:'0.6rem'}}>BERRIBOT.</Typography>
          <Typography variant='caption' sx={{fontSize:'0.6rem'}}> All rights reserved.</Typography>
        </Box>
      </Stack>
    </Box>
  );
}
