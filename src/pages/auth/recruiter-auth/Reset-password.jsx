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

import { SentIcon } from 'src/assets/icons';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFCode, RHFTextField } from 'src/components/hook-form';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useRecruiterAuthContext } from 'src/context/recruiter-context/recruiter-context';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthModernCompactLayout from 'src/layouts/auth/modern-compact';

// ----------------------------------------------------------------------

export default function ResetPassword() {

    const location = useLocation();
    const password = useBoolean();
    const navigate =useNavigate();

    const { setRecruiterAuthenticated, recruiterAuthenticated } = useRecruiterAuthContext();

    const [loading, setLoading] = useState(false);
    const [resetToken, setResetToken] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('reset_token');
        
        if (token) {
            setResetToken(token);
        } else {
            enqueueSnackbar('Invalid or missing reset token.', { variant: 'error' });
            // navigate('/login');
        }
    }, [location.search]);

    const NewPasswordSchema = Yup.object().shape({
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/[0-9]/, 'Password must contain at least one number')
            .matches(/[$@$!%?#&]/, 'Password must contain at least one special character')
            .min(8, 'Password must be at least 8 characters')
            .max(15, 'Password cannot be more than 15 characters')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .required('Confirm password is required')
            .oneOf([Yup.ref('password')], 'Passwords must match'),
    });

    const defaultValues = {
        // code: '',
        // email: '',
        password: '',
        confirmPassword: '',
    };

    const methods = useForm({
        mode: 'onChange',
        resolver: yupResolver(NewPasswordSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        // console.log(data, 'b', password)
        const data1 = {
            reset_token: resetToken,
            password: data.password,
        };
        setLoading(true);
        try {
            const response = await fetch(`${process.env.VITE_REACT_APP_PROCTOR_API_URL}users/reset_password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data1),
            });

            if (!response.ok) {
                enqueueSnackbar('Network response was not ok', { variant: 'error'})
            }
            const result = await response.json();
            // console.info('DATA', result);
            if (result.status === 'success') {
                setLoading(false);
                // console.log('Token:', result.token);
                // console.log('User:', result.user);
                // localStorage.setItem('token', result.token);
                // localStorage.setItem('user', JSON.stringify(result));
                // setAuthenticated(true);
                enqueueSnackbar('Reset Password successful', { variant: 'success', autoHideDuration: 2000, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                navigate(recruiterAuthenticated ? '/dashboard' : '/login');
            } else {
                setLoading(false);
                enqueueSnackbar(result?.message || 'Request failed', { variant: 'error', autoHideDuration: 2000, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            }
        } catch (error) {
            setLoading(false);
            console.error('Error during login:', error);
        }
    });

    const renderForm = (
        <Stack spacing={3} alignItems="center" >
            {/* <RHFTextField
        name="email"
        label="Email"
        placeholder="example@gmail.com"
        InputLabelProps={{ shrink: true }}
      />

      <RHFCode name="code" /> */}

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

            <RHFTextField
                name="confirmPassword"
                label="Confirm New Password"
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

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Atleast 1 uppercase, 1 lowercase, 1 number, 1 special character, Must contain 8 to 15 characters
            </Typography>
            <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
            >
                Update Password
            </LoadingButton>

            {/* <Typography variant="body2">
        {`Don’t have a code? `}
        <Link
          variant="subtitle2"
          sx={{
            cursor: 'pointer',
          }}
        >
          Resend code
        </Link>
      </Typography> */}

            <Link
                component={RouterLink}
                // href={paths.authDemo.classic.login}
                href={'/login'}
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
            <SentIcon sx={{ height: '4rem', mt: -2 }} />

            <Stack spacing={1} sx={{ mt: 1, mb: 2, width: '25rem' }} >
                <Typography variant="h3">Reset Password</Typography>

                {/* <Typography variant="h3">Request sent successfully!</Typography> */}

                {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          We&apos;ve sent a 6-digit confirmation email to your email.
          <br />
          Please enter the code in below box to verify your email.
        </Typography> */}
            </Stack>
        </>
    );

    return (
        <AuthModernCompactLayout >
            <FormProvider methods={methods} onSubmit={onSubmit} >
                {renderHead}

                {renderForm}
            </FormProvider>
        </AuthModernCompactLayout>
    );
}
