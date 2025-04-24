// src/pages/auth/recruiter-auth/TwoFactorView.jsx

import * as Yup from 'yup';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useCountdownSeconds } from './useCountdownSeconds';
import { useAuthContext } from 'src/auth/hooks';
import { EmailInboxIcon } from 'src/assets/icons';
import Iconify from 'src/components/iconify';
import FormProvider, { RHFCode } from 'src/components/hook-form';
import AuthModernCompactLayout from 'src/layouts/auth/modern-compact';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { enqueueSnackbar } from 'notistack';
import { useRecruiterAuthContext } from 'src/context/recruiter-context/recruiter-context';

export default function TwoFactorView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromParams = searchParams.get('email');

  const { resendCodeRegister } = useAuthContext();

  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { setRecruiterAuthenticated, recruiterAuthenticated } = useRecruiterAuthContext();

  // Initialize React Hook Form
  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(
      Yup.object().shape({
        code: Yup.string()
          .matches(/^[A-Z0-9]{6}$/, 'OTP must be 6 characters long with only capital letters and numbers') // Regex for capital letters and numbers only
          .required('Code is required'),
      })
    ),
    defaultValues: {
      code: '',
      email: localStorage.getItem('user_email', emailFromParams),
    },
  });

  const { watch, handleSubmit, formState: { isSubmitting }, setValue } = methods;
  const values = watch();

  const { countdown, startCountdown, resetCountdown } = useCountdownSeconds(60); // Initial countdown set to 10 seconds for testing

  // Start countdown immediately with the default value of 60 seconds
  useEffect(() => {
    startCountdown(60); // 60 seconds for initial wait time
    setCanResend(false);
  }, [startCountdown]);

  // Update state once countdown reaches 0 (after 60 seconds)
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
    }
  }, [countdown]);


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


  // Handle OTP submission
  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.VITE_REACT_APP_PROCTOR_API_URL}users/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          otp: data.code,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }

      const result = await response.json();

      if (result.status === 'failed') {
        setLoading(false);
        enqueueSnackbar(result.message, {
          variant: 'error',
          autoHideDuration: 2000,
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        });
      } else if (result.status === 'success') {
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
      console.error('Error during OTP verification:', error);
      enqueueSnackbar(error.message || 'Error during OTP verification', {
        variant: 'error',
        autoHideDuration: 2000,
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      });
    } finally {
      setLoading(false);
    }
  });

  // Handle Resend OTP Code
  const handleResendCode = useCallback(async () => {
    setResendLoading(true);
    
    try {
      // Sending POST request to the API to resend OTP
      const response = await fetch(`${process.env.VITE_REACT_APP_PROCTOR_API_URL}users/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,  // sending the email to the backend to resend OTP
        }),
      });
  
      const responseData = await response.json();  // Parsing the response from the server
      
      console.log('Resend Code Response:', responseData);
      
      if (responseData?.status === 'success') {
        enqueueSnackbar('OTP resent successfully', {
          variant: 'success',
          autoHideDuration: 2000,
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        });
        startCountdown(300); // Reset countdown to 5 minutes (300 seconds)
        setCanResend(false);  // Disable resend button after click
      } else {
        throw new Error(responseData.message || 'Failed to resend OTP.');
      }
    } catch (error) {
      console.error('Resend Code Error:', error);
      enqueueSnackbar(error.message || 'Failed to resend OTP.', {
        variant: 'error',
        autoHideDuration: 2000,
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      });
    } finally {
      setResendLoading(false);
    }
  }, [startCountdown, values.email]);

  // UI Render: Head and Form
  const renderHead = (
    <>
      <EmailInboxIcon sx={{ height: 96 }} />
      <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h6">Please check your email!</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          We have emailed a 6-digit confirmation code to {localStorage.getItem("user_email")}, please enter the code below to verify your email. OTP is valid for 5 minutes.
        </Typography>
      </Stack>
    </>
  );

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFCode name="code" />
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting || loading}
      >
        {isSubmitting || loading ? 'Verifying...' : 'Verify'}
      </LoadingButton>
      <Typography variant="body2">
        {`Don’t have a code? `}

        {canResend ? (
          <Link
            variant="subtitle2"
            onClick={handleResendCode}
            sx={{
              cursor: 'pointer',
              color: 'primary.main',
            }}
          >
            {resendLoading ? 'Resending...' : 'Resend code'}
          </Link>
        ) : (
          <Typography
            variant="subtitle2"
            component="span"
            sx={{ color: 'text.secondary' }}
          >
            Please wait {countdown}s before resending.
          </Typography>
        )}
      </Typography>
      <Link
        component={RouterLink}
        href='/login'
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

  return (
    <AuthModernCompactLayout>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderHead}
        {renderForm}
      </FormProvider>
    </AuthModernCompactLayout>
  );
}
