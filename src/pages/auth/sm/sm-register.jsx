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
import { useSMAuthContext } from 'src/context/sm-context/sm-context';

// ----------------------------------------------------------------------

export default function SMRegister() {
    const password = useBoolean();
    const navigate = useNavigate();
    const router = useRouter();

    const { setSMAuthenticated, smAuthenticated } = useSMAuthContext();

    const [loading, setLoading] = useState(false);

    const LoginSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().required('Email is required').email('Email must be a valid email address'),
        password: Yup.string().required('Password is required'),
    });

    const defaultValues = {
        name: '',
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
        // console.log('Authenticated:', authenticated);
        if (smAuthenticated) {
            router.replace('/sm/search');
            //  <Navigate to="/dashboard" />;
        }
    }, [smAuthenticated]);

    const onSubmit = handleSubmit(async (data) => {
        setLoading(true);
        try {
            const response = await fetch(`https://api-dev-searchmatch.berribot.com/v1/auth/create-user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            // console.info('DATA', result);
            if (result.status === 201) {
                setLoading(false);
                // console.log('User:', result.user);
                // localStorage.setItem('token', result.token);
                // localStorage.setItem('sm-user', result.user);
                // setSMAuthenticated(true);
                enqueueSnackbar(result.message, { variant: 'success', autoHideDuration: 2000, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
                navigate('/sm/login');
            }
            else {
                setLoading(false);
                enqueueSnackbar(result.message, { variant: 'error', autoHideDuration: 2000, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
            }
        } catch (error) {
            setLoading(false);
            console.error('Error during login:', error);
        }
    });

    const renderHead = (
        <Stack spacing={2} sx={{ mb: 5 }}>
            <Typography variant="h4" >Sign Up</Typography>

            <Stack direction="row" spacing={0.5}>
                <Typography variant="body2"> Already have an account?</Typography>

                <Link component={RouterLink}
                    //  href={paths.authDemo.modern.register} 
                    href={'/sm/login'}
                    variant="subtitle2">
                    Sign In
                </Link>
            </Stack>
        </Stack>
    );

    const renderForm = (
        <Stack spacing={2.5}>
            <RHFTextField name="name" label="Full Name" />

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

            {/* <Link
                // component={RouterLink}
                // href={'/forgot-password'}
                // href={paths.authDemo.modern.forgotPassword}
                variant="body2"
                color="inherit"
                underline="always"
                sx={{ alignSelf: 'flex-end' }}
            >
               Already have an account? Sign In?
            </Link> */}

            <LoadingButton
                fullWidth
                color="primary"
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
            // endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
            // sx={{ justifyContent: 'space-between', pl: 2, pr: 1.5 }}
            >
                Register
            </LoadingButton>
        </Stack>
    );

    return (
        <Box sx={{ overflow: 'hidden' }}>
            <Box
                sx={{
                    py: 10,
                    px: 3,
                    // backgroundColor: 'background.neutral',
                }}
            >
                <Card sx={{ p: 3, maxWidth: '25rem', margin: 'auto' }}>
                    <FormProvider methods={methods} onSubmit={onSubmit}>
                        {renderHead}

                        {renderForm}
                    </FormProvider>
                </Card>
            </Box>
        </Box>

    );
}
