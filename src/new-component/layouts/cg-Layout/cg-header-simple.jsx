import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useOffSetTop } from 'src/hooks/use-off-set-top';

import { bgBlur } from 'src/theme/css';

import Logo from 'src/components/logo';

import { HEADER } from '../config-layout';
import HeaderShadow from '../common/header-shadow';
import SettingsButton from '../common/settings-button';
import LanguagePopover from '../common/language-popover';
import NotificationsPopover from '../common/notifications-popover';
import ContactsPopover from '../common/contacts-popover';
import AccountPopover from '../common/account-popover';
import { Box, Divider, Typography } from '@mui/material';
import BaseOptions from 'src/components/settings/drawer/base-option';
import { useSettingsContext } from 'src/components/settings';
import CustomSwitch from 'src/new-component/custom-switch';
import React, { useEffect } from 'react';
import SMLogo from 'src/components/logo/sm-logo';
import SMAccountPopover from '../common/sm-account-popover';
import { useRecruiterAuthContext } from 'src/context/recruiter-context/recruiter-context';
import { useSMAuthContext } from 'src/context/sm-context/sm-context';
import CGLogo from 'src/components/logo/cg-logo';

// ----------------------------------------------------------------------

export default function CGHeaderSimple() {
  const theme = useTheme();
  // const { smAuthenticated } = useSMAuthContext();

  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);
  const settings = useSettingsContext();

  // useEffect(() => {
  //   settings.onUpdate('themeMode', 'dark')
  // }, [])
  // console.log(smAuthenticated,'sm')
  return (
    <AppBar>
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          height: {
            xs: HEADER.H_MOBILE - 10,
            md: HEADER.H_DESKTOP - 10,
          },
          transition: theme.transitions.create(['height'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          ...(offsetTop && {
            ...bgBlur({
              color: theme.palette.background.default,
            }),
            height: {
              md: HEADER.H_DESKTOP_OFFSET,
            },
          }),
          borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
          // backgroundColor: 'background.paper',
        }}
      >
        <Stack
          // flexGrow={1}
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          // spacing={{ xs: 0.5, sm: 0.5 }}
          spacing={1}
        ><CGLogo />
          {/* <Divider orientation='vertical' variant='middle' flexItem sx={{ minHeight: 25, borderWidth: 1 }} />
          <Logo /> */}
        </Stack>
        <Stack
          flexGrow={1}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={{ xs: 0.5, sm: 1 }}
        >
          {/* <LanguagePopover /> */}

          {/* <NotificationsPopover /> */}

          {/* <ContactsPopover /> */}

          {/* <SettingsButton /> */}
          <Box
            component="img"
            src='https://rntbci.in/images/rntbci-logo.svg'
            sx={{ width: 200, display: 'inline-flex' }}
          />

          <CustomSwitch
            value={settings.themeMode}
            onChange={(newValue) => settings.onUpdate('themeMode', newValue)}
            options={['light', 'dark']}
            icons={['sun', 'moon']} />
          {/* <div>
     

      <BaseOptions
        value={settings.themeMode}
        onChange={(newValue) => settings.onUpdate('themeMode', newValue)}
        options={['light', 'dark']}
        icons={['sun', 'moon']}
      />
    </div> */}



          {/* { smAuthenticated && <SMAccountPopover />} */}
        </Stack>
        {/* <Stack direction="row" alignItems="center" spacing={1}>
          <SettingsButton />

          <Link
            href={paths.faqs}
            component={RouterLink}
            color="inherit"
            sx={{ typography: 'subtitle2' }}
          >
            Need help?
          </Link>
        </Stack> */}
      </Toolbar>

      {offsetTop && <HeaderShadow />}
    </AppBar>
  );
}
