import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { PasswordIcon } from 'src/assets/icons';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { Box, Card } from '@mui/material';
import ComponentHero from 'src/sections/_examples/component-hero';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import AuthModernCompactLayout from 'src/layouts/auth/modern-compact';
import { useAuthContext } from 'src/context/useAuthContext';
import { useRouter } from 'src/routes/hooks';
import { useRecruiterAuthContext } from 'src/context/recruiter-context/recruiter-context';

// ----------------------------------------------------------------------

export default function ForgotPassword() {
  const navigate = useNavigate();
  const router = useRouter();

  const { recruiterAuthenticated } = useRecruiterAuthContext();

  const [loading, setLoading] = useState(false);
  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const defaultValues = {
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    // console.log('recruiterAuthenticated:', recruiterAuthenticated);
    if (recruiterAuthenticated) {
      router.replace('/');
      //  <Navigate to="/dashboard" />;
    }
  }, [recruiterAuthenticated]);
  // const onSubmit = handleSubmit(async (data) => {
  //   try {
  //     await new Promise((resolve) => setTimeout(resolve, 500));
  //     console.info('DATA', data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // });

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    // 'https://dev-impersonation-server.berribot.com'
    try {
      const response = await fetch(`${process.env.VITE_REACT_APP_PROCTOR_API_URL}users/humanless_forgot_password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // throw new Error('Network response was not ok');
        enqueueSnackbar('Network response was not ok', { variant: 'error'})
      }
      const result = await response.json();
      // console.info('DATA', result);
      if (result.status === 'failed') {
        setLoading(false);
        enqueueSnackbar(result.message, { variant: 'error', autoHideDuration: 2000, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
      } if (result.status === 'success') {
        setLoading(false);
        enqueueSnackbar(result.message, { variant: 'success', autoHideDuration: 2000, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        navigate('/login');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error during fetch:', error);
    }
  });
  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFTextField name="email" label="Email address" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Send Request
      </LoadingButton>

      <Link
        component={RouterLink}
        href={'/login'}
        // href={paths.authDemo.classic.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        Return to sign in
      </Link>
    </Stack>
  );

  const renderHead = (
    <>
      <PasswordIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h3">Forgot your password?</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Please enter the email address associated with your account and We will email you a link
          to reset your password.
        </Typography>
      </Stack>
    </>
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

      }}>
        <Card sx={{ p: 3, maxWidth: '25rem', margin: 'auto' }}> */}
      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderHead}

        {renderForm}
      </FormProvider>
      {/* </Card>
      </ComponentHero>
    </Box> */}
    </AuthModernCompactLayout>
  );
}
