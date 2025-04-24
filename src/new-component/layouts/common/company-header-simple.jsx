import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Stack, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ReactInternetSpeedMeter } from "react-internet-meter";
// import 'react-internet-meter/dist/index.css'

import { bgBlur } from 'src/theme/css';
import Logo from 'src/components/logo';
import SvgColor from 'src/components/svg-color';
import CustomSwitch from 'src/new-component/custom-switch';
import { useSettingsContext } from 'src/components/settings';
import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { HEADER } from '../config-layout';
import HeaderShadow from './header-shadow';

export default function CompanyHeaderSimple() {
  const theme = useTheme();
  const settings = useSettingsContext();
  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);

  useEffect(() => {
    settings.onUpdate('themeMode', 'dark');
  }, []);

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
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Logo />
        </Stack>
        <Stack flexGrow={1} direction="row" alignItems="center" justifyContent="flex-end" spacing={{ xs: 0.5, sm: 1 }}>

          <CustomSwitch
            value={settings.themeMode}
            onChange={(newValue) => settings.onUpdate('themeMode', newValue)}
            options={['light', 'dark']}
            icons={['sun', 'moon']}
          />
        </Stack>
      </Toolbar>

      {offsetTop && <HeaderShadow />}
    </AppBar>
  );
}
