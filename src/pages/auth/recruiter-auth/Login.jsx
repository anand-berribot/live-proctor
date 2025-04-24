import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { Box, Card } from '@mui/material';
import ComponentHero from 'src/sections/_examples/component-hero';
import { enqueueSnackbar } from 'notistack';
import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AuthModernCompactLayout from 'src/layouts/auth/modern-compact';
import { useRouter } from 'src/routes/hooks';
import { useRecruiterAuthContext } from 'src/context/recruiter-context/recruiter-context';

// ----------------------------------------------------------------------

export default function LoginView() {
  const password = useBoolean();
  const navigate = useNavigate();
  const router = useRouter();

  const { setRecruiterAuthenticated, recruiterAuthenticated } = useRecruiterAuthContext();

  const [loading, setLoading] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    // console.log('authenticated:', recruiterAuthenticated);

    if (recruiterAuthenticated) {
      const user = JSON.parse(localStorage.getItem('recruiter-user'));
      if (user?.is_owner) {
        router.replace('/super-admin/dashboard');
      } else if (user?.is_admin) {
        router.replace('/admin/report');
      } else if (user?.is_user) {
        router.replace('/dashboard');
      } else {
        console.error('Unhandled role in user object:', user);
        router.replace('/login');
      }
    }
  }, [recruiterAuthenticated, router]);

  // useEffect(() => {
  //   if (recruiterAuthenticated) {
  //     const user = JSON.parse(localStorage.getItem('recruiter-user'));
  //     if (user?.is_admin) {
  //       router.replace('/admin/dashboard');
  //     } else {
  //       router.replace('/dashboard');
  //     }
  //   }
  // }, [recruiterAuthenticated, router]);
  // useEffect(() => {
  //   // console.log('recruiterAuthenticated:', recruiterAuthenticated);
  //   if (recruiterAuthenticated) {
  //     router.replace('/dashboard');
  //     //  <Navigate to="/dashboard" />;
  //   }
  // }, [recruiterAuthenticated]);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      data.time_zone = tz
      
      const response = await fetch(`${process.env.VITE_REACT_APP_PROCTOR_API_URL}users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // if (!response.ok) {
      //   throw new Error('Network response was not ok');
      // }

      const result = await response.json();
      console.warn(result, '&&&&&&&&&&&&&&&&')
      if(result.status === "otp_required") {
        localStorage.setItem("user_email", data.email)
        localStorage.setItem("otp_expiry_time", result.otp_expiry_time)
        router.replace('/verify-2fa');
        return;
      }

      if (!response.ok) {
        setLoading(false);
        enqueueSnackbar(result.message, {
          variant: 'error',
          autoHideDuration: 2000,
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        });
      } else if (response.status === 200) {
        setLoading(false);
        localStorage.setItem('recruiter-token', result.token);
        localStorage.setItem('recruiter-user', JSON.stringify(result));

        await getCompany();
        setRecruiterAuthenticated(true);

        enqueueSnackbar('Login successful', {
          variant: 'success',
          autoHideDuration: 2000,
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        });

        // if (result.is_admin) {
        //   router.replace('/admin/dashboard');
        // } else {
        //   router.replace('/dashboard');
        // }
        if (result?.is_owner) router.replace('/super-admin/dashboard');
        else if (result?.is_admin) router.replace('/admin/report');
        else if (result?.is_user) router.replace('/dashboard');
        else router.replace('/login');

      }
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(error.message, {
        variant: 'error',
        autoHideDuration: 2000,
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      });
      console.error('Error during login:', error);
    }
  });

  const onSubmit1 = handleSubmit(async (data) => {
    setLoading(true);
    // 'https://dev-impersonation-server.berribot.com'
    try {
      const response = await fetch(`${process.env.VITE_REACT_APP_PROCTOR_API_URL}users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // nidhinmahendran@berribot.com
      // gtmc9k9RHUn7Qn5K
      const result = await response.json();
      // console.info('DATA', result);
      if (result.status === 'failed') {
        setLoading(false);
        enqueueSnackbar(result.message, { variant: 'error', autoHideDuration: 2000, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
      } if (result.status === 'success') {
        setLoading(false);
        // console.log('Token:', result.token);
        // console.log('User:', result);
        localStorage.setItem('recruiter-token', result.token);
        localStorage.setItem('recruiter-user', JSON.stringify(result));
        try {
          await getCompany();
          setRecruiterAuthenticated(true);
          enqueueSnackbar('Login successful', { variant: 'success', autoHideDuration: 2000, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
          if (result?.is_admin) {
            router.replace('/admin/dashboard');
          } if (result?.is_user) {
            router.replace('/dashboard');
          }
        } catch (error) {
          enqueueSnackbar('Failed to fetch company data', { variant: 'error', autoHideDuration: 2000, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
        // await getCompany();
        // setRecruiterAuthenticated(true);
        // enqueueSnackbar('Login successful', { variant: 'success', autoHideDuration: 2000, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        // navigate('/dashboard');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error during login:', error);
    }
  });

  const getCompany = async () => {
    try {
      const response = await fetch(`${process.env.VITE_REACT_APP_PROCTOR_API_URL}humanless/get-company-details`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('recruiter-token')}`,
        },
      });

      if (response.status === 200) {
        const result = await response.json();
        localStorage.setItem('recruiter-company', JSON.stringify(result?.data));
        // console.log('Company data:', result);
      } else {
        console.log('Company response:', response);
        enqueueSnackbar('Failed to fetch company data', { variant: 'error', autoHideDuration: 2000, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
      }
    } catch (error) {
      console.error('Error during login:', error);
      enqueueSnackbar('Failed to fetch company data', { variant: 'error', autoHideDuration: 2000, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
    }
  };
  // const onSubmit = handleSubmit(async (data) => {
  //   try {
  //     await new Promise((resolve) => setTimeout(resolve, 500));
  //     console.info('DATA', data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4" >Sign In</Typography>

      {/* <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">New user?</Typography>

        <Link component={RouterLink}
          //  href={paths.authDemo.modern.register} 
          href={'/register'}
          variant="subtitle2">
          Create an account
        </Link>
      </Stack> */}
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <RHFTextField name="email" label="Email address" />

      <RHFTextField
        name="password"
        label="Password"
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Link
        component={RouterLink}
        href={'/forgot-password'}
        // href={paths.authDemo.modern.forgotPassword}
        variant="body2"
        color="inherit"
        underline="always"
        sx={{ alignSelf: 'flex-end' }}
      >
        Forgot password?
      </Link>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
        sx={{ justifyContent: 'space-between', pl: 2, pr: 1.5 }}
      >
        Login
      </LoadingButton>
    </Stack>
  );

  return (
    <AuthModernCompactLayout>
      {/* <Box sx={{ overflow: 'hidden' }}>
      <ComponentHero sx={{
        position: 'absolute',
        top: 0,
        overflow: 'hidden',
        // height: { xs: '73vh', sm: '70vh', md: '79vh', lg: '82vh' },
        height: '100vh',
        width: '100%',

      }}> */}
      {/* <Card sx={{ p: 3, maxWidth: '25rem', margin: 'auto' }}> */}
      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderHead}

        {renderForm}
      </FormProvider>
      {/* </Card> */}
      {/* </ComponentHero>
    </Box> */}
    </AuthModernCompactLayout>
  );
}
