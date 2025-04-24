import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';

import { bgBlur } from 'src/theme/css';

import Logo from 'src/components/logo';
import SvgColor from 'src/components/svg-color';
import { useSettingsContext } from 'src/components/settings';

import Searchbar from '../common/searchbar';
import { NAV, HEADER } from '../config-layout';
import SettingsButton from '../common/settings-button';
import AccountPopover from '../common/account-popover';
import ContactsPopover from '../common/contacts-popover';
import LanguagePopover from '../common/language-popover';
import NotificationsPopover from '../common/notifications-popover';
import CustomSwitch from 'src/new-component/custom-switch';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

export default function Header({ onOpenNav }) {

  const theme = useTheme();

  const settings = useSettingsContext();

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  const isNavMini = settings.themeLayout === 'mini';

  const lgUp = useResponsive('up', 'lg');

  const offset = useOffSetTop(HEADER.H_DESKTOP);

  const offsetTop = offset && !isNavHorizontal;
  const [companyLogo, setCompanyLogo] = useState('');

  useEffect(() => {
    if (localStorage.getItem('recruiter-company')) {
      const data = JSON.parse(localStorage.getItem('recruiter-company'));
      setCompanyLogo(data?.company_logo);
    }
  }, [localStorage.getItem('recruiter-company')]);

  const renderContent = (
    <>
      {lgUp && isNavHorizontal && <Logo sx={{ mr: 2.5 }} />}

      {!lgUp && (
        <IconButton onClick={onOpenNav}>
          <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
        </IconButton>
      )}

      {/* <Searchbar /> */}

      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.5, sm: 1 }}
      >
        {/* <LanguagePopover />

        <NotificationsPopover />

        <ContactsPopover />

        <SettingsButton /> */}
        <Box
          sx={{
            width: {
              xs: '40%',  // 40% width on extra small screens
              sm: '25%',  // 25% width on small screens
              md: '15%',  // 15% width on medium screens
              lg: '10%',  // 10% width on large screens
            },
            maxWidth: '85px !important', // Set a max width to prevent the image from becoming too large
            height: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center', // Center the image within the Box
          }}
        >
          {companyLogo && (
            <img
              src={companyLogo}
              alt="logo"
              style={{
                width: '100%',       // Make sure the image scales to fit the width of the container
                height: 'auto',     // Maintain aspect ratio
                objectFit: 'contain', // Ensure the image fits within the container without distortion
                marginRight: '0.5rem',
              }}
            />
          )}
        </Box>
        <CustomSwitch
          value={settings.themeMode}
          onChange={(newValue) => settings.onUpdate('themeMode', newValue)}
          options={['light', 'dark']}
          icons={['sun', 'moon']} />

        <AccountPopover />
      </Stack>
    </>
  );
  return (
    <AppBar
      sx={{
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.W_VERTICAL + 1}px)`,
          height: HEADER.H_DESKTOP,
          ...(offsetTop && {
            height: HEADER.H_DESKTOP_OFFSET,
          }),
          ...(isNavHorizontal && {
            width: 1,
            bgcolor: 'background.default',
            height: HEADER.H_DESKTOP_OFFSET,
            borderBottom: `dashed 1px ${theme.palette.divider}`,
          }),
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI + 1}px)`,
          }),
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
};
