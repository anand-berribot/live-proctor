import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useMockedUser } from 'src/hooks/use-mocked-user';

// import { useAuthContext } from 'src/auth/hooks';

import { varHover } from 'src/components/animate';
import { useSnackbar } from 'src/components/snackbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useRecruiterAuthContext } from 'src/context/recruiter-context/recruiter-context';
import { useSMAuthContext } from 'src/context/sm-context/sm-context';

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

export default function SMAccountPopover() {
  const router = useRouter();

  // const { user } = useMockedUser();

  const { smLogout } = useSMAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const popover = usePopover();

  const handleLogout = async () => {
    try {
      smLogout();
      popover.onClose();
      router.replace('/sm/login');
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
          src={localStorage.getItem('sm-user')}
          alt={localStorage.getItem('sm-user')}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {localStorage.getItem('sm-user')?.charAt(0).toUpperCase()}
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
            <Typography variant='body2' component={'span'} sx={{ color: 'text.secondary' }}>Hi ,</Typography> {localStorage.getItem('sm-user')}
          </Typography>
          {/* <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {JSON.parse(localStorage.getItem('recruiter-user'))?.email}
          </Typography> */}
        </Box>
        {/* <Divider sx={{ borderStyle: 'dashed' }} />
        <MenuItem
          onClick={() => router.push('/reset-password')}
          sx={{ m: 1, mt: .5 }}>
          {'Reset Password'}
        </MenuItem> */}
        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* <Stack sx={{ p: 1 }}>
          {OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={() => handleClickItem(option.linkTo)}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} /> */}

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
