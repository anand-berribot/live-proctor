import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Stack,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    useTheme,
    LinearProgress,
} from '@mui/material';
import { m } from 'framer-motion';
import getVariant from 'src/sections/_examples/extra/animate-view/get-variant';
import Iconify from 'src/components/iconify';
import { useMastermind } from 'src/context/mastermind-context';

export default function TermsAndConditions({ accesskey }) {
    const { setCurrentPage, candidateData } = useMastermind();
    const theme = useTheme();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const contentRef = useRef(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const PROCTOR_API_URL = process.env.VITE_REACT_APP_PROCTOR_API_URL;

    const termsAndConditions = JSON.parse(candidateData.Interviews[0].terms_and_condition_template);
    const [content, setContent] = useState({
        title: termsAndConditions.Header || '',
        description: '',
    });

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 2;
        setIsScrolledToBottom(isAtBottom);
    };

    const handleAcceptance = async (acceptanceStatus) => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`${PROCTOR_API_URL}humanless/post_terms_and_condition_acceptance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    candidate_id: candidateData.Interviews[0].candidate_id,
                    interview_id: candidateData.Interviews[0].id,
                    acceptance_status: acceptanceStatus,
                }),
            });

            const responseData = await response.json();

            if (response.ok) {
                if (acceptanceStatus) {
                    setCurrentPage('TECHNICAL_READINESS_CHECK');
                } else {
                    navigate(`/opted-out-candidate/${accesskey}`);
                }
            } else {
                enqueueSnackbar(responseData.message || 'Something went wrong. Please try again.', {
                    variant: 'error',
                });
                setOpenConfirm(true);
            }
        } catch (error) {
            enqueueSnackbar('Something went wrong. Please try again.', { variant: 'error' });
            console.error(`Submission error: ${error}`);
            setOpenConfirm(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmation = () => {
        handleAcceptance(actionType === 'agree');
    };

    useEffect(() => {
        const loadContent = setTimeout(() => {
            setContent((prev) => ({
                ...prev,
                description: termsAndConditions.content || '',
            }));
        }, 50);

        return () => clearTimeout(loadContent);
    }, []);

    useEffect(() => {
        if (contentRef.current) {
            const { scrollHeight, clientHeight } = contentRef.current;
            setIsScrolledToBottom(scrollHeight <= clientHeight);
        }
    }, [content.description]);

    const fullName = candidateData
        ? `${candidateData.first_name || ''} ${candidateData.last_name || ''}`.trim() || 'Candidate'
        : 'Candidate';

    // Welcome Card Component
    const WelcomeCard = () => (
        <Card
            sx={{
                height: '100%',
                background: theme.palette.background.paper,
                borderRadius: 2,
                boxShadow: theme.shadows[3],
            }}
        >
            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Stack spacing={2} flexGrow={1}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                        Welcome, {fullName}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}>
                        <Stack spacing={1.5}>
                            <InfoItem icon="ion:briefcase-outline" title="Position" value={candidateData?.Interviews[0]?.job_role} />
                            <InfoItem icon="ion:business-outline" title="Company" value={candidateData?.Interviews[0]?.client_name} />
                        </Stack>
                    </Box>
                    <LinearProgress variant="determinate" value={100} sx={{ borderRadius: 5, height: 8 }} />
                </Stack>
            </CardContent>
        </Card>
    );

    const InfoItem = ({ icon, title, value }) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
            <Iconify icon={icon} width={24} sx={{ color: theme.palette.primary.main }} />
            <Box>
                <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
                <Typography variant="body1" fontWeight={500} color="text.primary">{value}</Typography>
            </Box>
        </Stack>
    );

    return (
        <>
            <Stack component={m.div} {...getVariant('fadeInRight')} sx={{ minWidth: 400, position: 'relative', top: '15px' }}>
                <Grid container spacing={3}>
                    {/* Welcome Card */}
                    <Grid item xs={12} md={4}>
                        <WelcomeCard />
                    </Grid>

                    {/* Terms and Conditions Card */}
                    <Grid item xs={12} md={8}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: 2,
                                boxShadow: theme.shadows[3],
                            }}
                        >
                            <CardContent
                                sx={{
                                    p: 3,
                                    background: theme.palette.background.paper,
                                    flexGrow: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="h5" sx={{ color: theme.palette.text.primary }}>
                                        {content.title}
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary }}>
                                        {termsAndConditions.subject}
                                    </Typography>
                                </Box>

                                {/* Scrollable Terms Content */}
                                <Box
                                    ref={contentRef}
                                    onScroll={handleScroll}
                                    sx={{
                                        flexGrow: 1,
                                        overflow: 'auto',
                                        border: `1px solid ${theme.palette.divider}`,
                                        borderRadius: 2,
                                        p: 2.5,
                                        background: theme.palette.background.paper,
                                        position: 'relative',
                                        height: '380px',
                                        '&::-webkit-scrollbar': { width: '8px' },
                                        '&::-webkit-scrollbar-track': { background: theme.palette.grey[200], borderRadius: '4px' },
                                        '&::-webkit-scrollbar-thumb': {
                                            background: theme.palette.primary.main,
                                            borderRadius: '4px',
                                            '&:hover': { background: theme.palette.primary.dark },
                                        },
                                    }}
                                >
                                    <div
                                        dangerouslySetInnerHTML={{ __html: content.description }}
                                        style={{
                                            whiteSpace: 'pre-wrap',
                                            lineHeight: 1.6,
                                            color: theme.palette.text.secondary,
                                        }}
                                    />

                                    {/* Scroll Indicator */}
                                    {!isScrolledToBottom && (
                                        <Box
                                            component={m.div}
                                            initial={{ y: 0 }}
                                            animate={{ y: 10 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                                            sx={{
                                                position: 'absolute',
                                                bottom: 40,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                color: theme.palette.text.secondary,
                                            }}
                                        >
                                            <Iconify icon="ion:chevron-down-outline" width={24} />
                                        </Box>
                                    )}
                                </Box>
                            </CardContent>

                            {/* Action Buttons */}
                            <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}`, flexShrink: 0 }}>
                                <Stack direction="row" spacing={2} justifyContent="space-between">
                                    <Button
                                        variant="contained"
                                        color="error"
                                        disabled={!isScrolledToBottom || isSubmitting}
                                        onClick={() => {
                                            setActionType('disagree');
                                            setOpenConfirm(true);
                                        }}
                                        startIcon={<Iconify icon="ion:close-circle" />}
                                        sx={{ width: 120, borderRadius: 0.5, fontWeight: 500 }}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Disagree'}
                                    </Button>

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={!isScrolledToBottom || isSubmitting}
                                        onClick={() => {
                                            setActionType('agree');
                                            setOpenConfirm(true);
                                        }}
                                        startIcon={<Iconify icon="ion:checkmark-circle" />}
                                        sx={{ width: 120, borderRadius: 0.5, fontWeight: 500 }}
                                    >
                                        {isSubmitting ? 'Submitting...' : ' Agree'}
                                    </Button>
                                </Stack>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </Stack>

            {/* Confirmation Dialog */}
            <Dialog
                open={openConfirm}
                onClose={() => !isSubmitting && setOpenConfirm(false)}
                PaperProps={{ sx: { borderRadius: 2, width: '100%', maxWidth: 600, boxShadow: '0px 10px 30px rgba(0,0,0,0.2)' } }}
                BackdropProps={{ sx: { backdropFilter: 'blur(3px)', backgroundColor: 'rgba(0,0,0,0.5)' } }}
            >
                <DialogTitle sx={{ bgcolor: theme.palette.background.paper, borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Iconify
                            icon={actionType === 'agree' ? 'ion:checkmark-circle' : 'ion:close-circle'}
                            color={actionType === 'agree' ? theme.palette.success.main : theme.palette.error.main}
                        />
                        <Typography variant="h6">
                            {actionType === 'agree' ? ' Agree' : 'Disagree'}
                        </Typography>
                    </Stack>
                </DialogTitle>
                <DialogContent sx={{ pt: 3, textAlign: 'center' }}>
                    <DialogContentText sx={{ fontSize: '1.1rem', color: theme.palette.text.primary }}>
                        {actionType === 'agree'
                            ? 'By agreeing, you consent to proceed with the AI Interview. This action will be recorded for compliance purposes.'
                            : 'By disagreeing, you opt out of the AI Interview. An alternative evaluation process will be arranged, and further instructions will be provided.'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
                    <Button
                        variant="outlined"
                        onClick={() => setOpenConfirm(false)}
                        sx={{
                            borderRadius: 1,
                            minWidth: 120,
                            fontWeight: 500,
                            color: theme.palette.text.primary,
                            borderColor: theme.palette.divider,
                            '&:hover': { borderColor: theme.palette.primary.main, backgroundColor: theme.palette.action.hover },
                        }}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color={actionType === 'agree' ? 'primary' : 'error'}
                        onClick={handleConfirmation}
                        sx={{
                            borderRadius: 1,
                            minWidth: 120,
                            fontWeight: 500,
                            boxShadow: 'none',
                            '&:hover': { boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' },
                        }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Processing...' : 'Confirm'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}