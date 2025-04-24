import React, { useEffect, useState } from 'react';
import { m } from 'framer-motion';
import { Box, Card, Stack, Rating, TextField, Button, Typography } from '@mui/material';
import PersonalGoalsImage from '../../assets/mastermind_animation/Personal goals-amico.svg';
import getVariant from 'src/sections/_examples/extra/animate-view/get-variant';
import { enqueueSnackbar } from 'notistack';
import { useMastermind } from 'src/context/mastermind-context';

export default function BotSuccess({ }) {

    const { setCurrentPage, candidateData } = useMastermind();
    const [rating, setRating] = useState(0);
    const [comments, setComments] = useState('');
    const [isFormSubmitted, setisFormSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // To track if submission is in progress

    const MASTERMIND_API_URL = process.env.VITE_REACT_APP_API_URL;
    const PROCTOR_API_URL = process.env.VITE_REACT_APP_PROCTOR_API_URL;

    const postFeedback = async () => {
        // Prevent double clicks
        if (isSubmitting) return;

        setIsSubmitting(true); // Start the submission process

        const feedbackData = {
            candidate_id: candidateData?.Interviews[0].candidate_id,
            interview_id: candidateData?.Interviews[0].id,
            comments: comments,
            ratings: rating,
            created_by: candidateData?.Interviews[0].created_by,
        };

        try {
            const response = await fetch(`${MASTERMIND_API_URL}post-candidate-feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(feedbackData)
            });
            const data = await response.json();
            setisFormSubmitted(true);
            console.log(`Feedback submitted successfully: ${data}`);
            enqueueSnackbar('Feedback submitted successfully', { variant: 'success', autoHideDuration: 3000, anchorOrigin: { vertical: 'top', horizontal: 'right' } });
        } catch (error) {
            console.error(`Error posting feedback:${error}`);
            enqueueSnackbar('Failed to send feedback', { variant: 'error', autoHideDuration: 3000, anchorOrigin: { vertical: 'top', horizontal: 'right' } });
        } finally {
            setIsSubmitting(false); // End the submission process
        }
    };


    return (
        <>
            <Card
                component={m.div}
                {...getVariant('fadeInRight')}
                sx={{
                    pt: '3vh',
                    pb: '3vh',
                    pl: '3vw',
                    pr: '3vw',
                    m: 2,
                    ml: 4,
                    mr: 4,
                    bgcolor: 'background.bg',
                }}
            >
                <Stack
                    component={Card}
                    sx={{
                        minHeight: '77vh',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        p: 1,
                    }}
                >
                    <Box
                        sx={{
                            width: { xs: '100%', md: '50%' },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: { xs: 3, md: 0 },
                        }}
                    >
                        <img
                            src={PersonalGoalsImage}
                            alt="Personal Goals"
                            style={{ width: '100%', height: 'auto', maxHeight: '70vh' }}
                        />
                    </Box>

                    <Box
                        sx={{
                            width: { xs: '100%', md: '48%' },
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                        }}
                        spacing={2}
                    >

                        {sessionStorage.getItem('has_recruiter') === 'true' ? (
                            <Box sx={{ width: '100%' }}>
                                <p>
                                    Please reach out to your recruiter for feedback regarding your interview.
                                </p>
                            </Box>
                        ) : (
                            <Box sx={{ width: '100%' }}>
                                <p>
                                    Thank you for being part of our <strong>Revolutionary Interview Experience</strong>!
                                </p>
                                <p>
                                    Hope you have enjoyed it. You will receive the feedback for this interview <br /> <strong>within 48 hrs</strong> to your registered email id.
                                </p>
                            </Box>
                        )}

                        {!isFormSubmitted && (
                            <Box sx={{ width: '100%', p: 1 }} spacing={2}>
                                <Typography variant='h6' sx={{ mb: 1 }}>Rate Your Experience</Typography>
                                <Rating
                                    name="size-large"
                                    value={rating}
                                    precision={1}
                                    onChange={(event, newValue) => {
                                        setRating(newValue);
                                    }}
                                    size="large"
                                />
                                <TextField
                                    label="Feedback"
                                    multiline
                                    rows={4}
                                    maxRows={10}
                                    aria-label="maximum height"
                                    placeholder="Share your thoughts..."
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    variant="outlined"
                                    sx={{ width: '100%', mt: 1 }}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={postFeedback}
                                    disabled={rating === 0 || isSubmitting} // Disable if submitting
                                    sx={{
                                        mt: 1,
                                        width: 120,
                                        alignSelf: 'center',
                                        borderRadius: 0.5,
                                        fontWeight: 500,
                                    }}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Stack>
            </Card>
        </>
    );
}
