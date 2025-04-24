import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Badge, { badgeClasses } from '@mui/material/Badge';

// import { paths } from 'src/routes/paths';

import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';

import { bgBlur } from 'src/theme/css';

import Logo from 'src/components/logo';
// import Label from 'src/components/label';
// import NavMobile from 'src/layouts/main/nav/mobile';
import HeaderShadow from 'src/layouts/common/header-shadow';
// import NavDesktop from 'src/layouts/main/nav/desktop';

// import NavMobile from './nav/mobile';
// import NavDesktop from './nav/desktop';
// import { HEADER } from '../config-layout';
// import { navConfig } from './config-navigation';
// import LoginButton from '../common/login-button';
// import HeaderShadow from '../common/header-shadow';
// import SettingsButton from '../common/settings-button';

// ----------------------------------------------------------------------

// import { paths } from 'src/routes/paths';

// import { PATH_AFTER_LOGIN } from 'src/config-global';

import Iconify from 'src/components/iconify';
import { HEADER } from 'src/layouts/config-layout';
import SettingsButton from 'src/layouts/common/settings-button';

// ----------------------------------------------------------------------

// export const navConfig = [
//   {
//     title: 'Home',
//     icon: <Iconify icon="solar:home-2-bold-duotone" />,
//     path: '/',
//   },
//   {
//     title: 'Components',
//     icon: <Iconify icon="solar:atom-bold-duotone" />,
//     path: paths.components,
//   },
//   {
//     title: 'Pages',
//     path: '/pages',
//     icon: <Iconify icon="solar:file-bold-duotone" />,
//     children: [
//       {
//         subheader: 'Other',
//         items: [
//           { title: 'About us', path: paths.about },
//           { title: 'Contact us', path: paths.contact },
//           { title: 'FAQs', path: paths.faqs },
//           { title: 'Pricing', path: paths.pricing },
//           { title: 'Payment', path: paths.payment },
//           { title: 'Maintenance', path: paths.maintenance },
//           { title: 'Coming Soon', path: paths.comingSoon },
//         ],
//       },
//       {
//         subheader: 'Concepts',
//         items: [
//           { title: 'Shop', path: paths.product.root },
//           { title: 'Product', path: paths.product.demo.details },
//           { title: 'Checkout', path: paths.product.checkout },
//           { title: 'Posts', path: paths.post.root },
//           { title: 'Post', path: paths.post.demo.details },
//         ],
//       },
//       {
//         subheader: 'Auth Demo',
//         items: [
//           { title: 'Login', path: paths.authDemo.classic.login },
//           { title: 'Register', path: paths.authDemo.classic.register },
//           {
//             title: 'Forgot password',
//             path: paths.authDemo.classic.forgotPassword,
//           },
//           { title: 'New password', path: paths.authDemo.classic.newPassword },
//           { title: 'Verify', path: paths.authDemo.classic.verify },
//           { title: 'Login (modern)', path: paths.authDemo.modern.login },
//           { title: 'Register (modern)', path: paths.authDemo.modern.register },
//           {
//             title: 'Forgot password (modern)',
//             path: paths.authDemo.modern.forgotPassword,
//           },
//           {
//             title: 'New password (modern)',
//             path: paths.authDemo.modern.newPassword,
//           },
//           { title: 'Verify (modern)', path: paths.authDemo.modern.verify },
//         ],
//       },
//       {
//         subheader: 'Error',
//         items: [
//           { title: 'Page 403', path: paths.page403 },
//           { title: 'Page 404', path: paths.page404 },
//           { title: 'Page 500', path: paths.page500 },
//         ],
//       },
//       {
//         subheader: 'Dashboard',
//         items: [{ title: 'Dashboard', path: PATH_AFTER_LOGIN }],
//       },
//     ],
//   },
//   {
//     title: 'Docs',
//     icon: <Iconify icon="solar:notebook-bold-duotone" />,
//     path: paths.docs,
//   },
// ];


export default function Header() {
  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);

  return (
    <AppBar>
      <Toolbar
        disableGutters
        sx={{
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_DESKTOP,
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
        }}
      >
        <Container sx={{ height: 1, display: 'flex', alignItems: 'center' }}>
          <Badge
            sx={{
              [`& .${badgeClasses.badge}`]: {
                top: 8,
                right: -16,
              },
            }}
            // badgeContent={
            //   <Link
            //     href={paths.changelog}
            //     target="_blank"
            //     rel="noopener"
            //     underline="none"
            //     sx={{ ml: 1 }}
            //   >
            //     <Label color="info" sx={{ textTransform: 'unset', height: 22, px: 0.5 }}>
            //       v5.7.0
            //     </Label>
            //   </Link>
            // }
          >
            <Logo />
          </Badge>

          <Box sx={{ flexGrow: 1 }} />

          {/* {mdUp && <NavDesktop data={navConfig} />} */}

          <Stack alignItems="center" direction={{ xs: 'row', md: 'row-reverse' }}>
            {/* <Button variant="contained" target="_blank" rel="noopener" href={paths.minimalUI}>
              Purchase Now
            </Button> */}

            {/* {mdUp && <LoginButton />} */}

            <SettingsButton
              sx={{
                // ml: { xs: 1, md: 0 },
                // mr: { md: 2 },
              }}
            />

            {/* {!mdUp && <NavMobile data={navConfig} />} */}
          </Stack>
        </Container>
      </Toolbar>
      {/* <HeaderShadow /> */}
      {offsetTop && <HeaderShadow />}
    </AppBar>
  );
}
