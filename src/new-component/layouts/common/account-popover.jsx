import { m } from 'framer-motion';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useMockedUser } from 'src/hooks/use-mocked-user';
import { enqueueSnackbar } from 'notistack';

// import { useAuthContext } from 'src/auth/hooks';

import { varHover } from 'src/components/animate';
import { useSnackbar } from 'src/components/snackbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useRecruiterAuthContext } from 'src/context/recruiter-context/recruiter-context';
import React, { useState, useEffect } from 'react';
import { Box, Typography, MenuItem, Divider, Switch, FormControlLabel } from '@mui/material';
// ----------------------------------------------------------------------

const OPTIONS = [
  // {
  //   label: 'Home',
  //   linkTo: '/',
  // },
  // {
  //   label: 'Profile',
  //   linkTo: paths.dashboard.user.profile,
  // },
  // {
  //   label: 'Settings',
  //   linkTo: paths.dashboard.user.account,
  // },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const router = useRouter();

  const { user } = useMockedUser();

  const { recruiterLogout } = useRecruiterAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const popover = usePopover();


  // const handleLogout = async () => {
  //   try {
  //     await logout();
  //     popover.onClose();
  //     router.replace('/');
  //   } catch (error) {
  //     console.error(error);
  //     enqueueSnackbar('Unable to logout!', { variant: 'error' });
  //   }
  // };
  const handleLogout = async () => {
    try {
      recruiterLogout();
      popover.onClose();
      router.replace('/login');
      enqueueSnackbar('Logged out successfully', { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  const handleClickItem = (path) => {
    popover.onClose();
    router.push(path);
  };
  // console.log('recruiter-user', JSON.parse(localStorage.getItem('recruiter-user'))?.first_name)


  const recruiterUser = JSON.parse(localStorage.getItem('recruiter-user'));
  const [toggleState, setToggleState] = useState(recruiterUser?.user_is_2fa_enabled || false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (recruiterUser) {
      setToggleState(recruiterUser.user_is_2fa_enabled);
    }
  }, [recruiterUser]);

  const handleToggle = async (event) => {
    const newState = event.target.checked;
    setToggleState(newState);
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.VITE_REACT_APP_PROCTOR_API_URL}humanless/users/${recruiterUser.user_id}/update-2fa`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_2fa_enabled: newState }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update 2FA status');
      }

      const responseData = await response.json();
      recruiterUser.user_is_2fa_enabled = responseData.is_2fa_enabled;
      localStorage.setItem('recruiter-user', JSON.stringify(recruiterUser));

      enqueueSnackbar('2FA has been updated successfully.', { variant: 'success', autoHideDuration: 2000 });
    } catch (error) {
      enqueueSnackbar('There was an error update 2FA. Please try again.', { variant: 'error', autoHideDuration: 2000 });
      setToggleState(!newState);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(popover.open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={JSON.parse(localStorage.getItem('recruiter-user'))?.first_name}
          alt={JSON.parse(localStorage.getItem('recruiter-user'))?.email}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {JSON.parse(localStorage.getItem('recruiter-user'))?.first_name?.charAt(0).toUpperCase()}
        </Avatar>
        {/* <Avatar
          src={user?.photoURL}
          alt={user?.displayName}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {user?.displayName?.charAt(0).toUpperCase()}
        </Avatar> */}
      </IconButton>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ minWidth: 200, p: 0 }}>
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {/* {user?.displayName} */}
            <Typography variant='body2' component={'span'} sx={{ color: 'text.secondary' }}>Hi ,</Typography> {JSON.parse(localStorage.getItem('recruiter-user'))?.first_name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {/* {user?.email} */}
            {JSON.parse(localStorage.getItem('recruiter-user'))?.email}
          </Typography>
        </Box>
        {/* <Divider sx={{ borderStyle: 'dashed' }} />
        <MenuItem
          onClick={() => router.push('/reset-password')}
          sx={{ m: 1, mt: .5 }}>
          {'Reset Password'}
        </MenuItem>
        <Divider sx={{ borderStyle: 'dashed' }} /> */}

        {/* <Stack sx={{ p: 1 }}>
          {OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={() => handleClickItem(option.linkTo)}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} /> */}

        {recruiterUser && recruiterUser.compay_is_2fa_enabled && (
          <>
            <Divider sx={{ borderStyle: 'dashed' }} />
            <Box sx={{ p: 1 }}>
              <FormControlLabel
                control={<Switch checked={toggleState} onChange={handleToggle} />}
                label="Enable 2FA"
              />
            </Box>
          </>
        )}

        <MenuItem
          onClick={handleLogout}
          sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'error.main' }}
        >
          Logout
        </MenuItem>
      </CustomPopover>
    </>
  );
}
