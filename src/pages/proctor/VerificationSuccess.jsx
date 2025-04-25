import { Card, Typography, Stack, Box } from '@mui/material';
import { m } from 'framer-motion';
import PersonalGoalsImage from '../../assets/mastermind_animation/Personal goals-amico.svg';
import getVariant from 'src/sections/_examples/extra/animate-view/get-variant';

export default function VerificationSuccess() {
    return (
        <Card
  sx={{
    minHeight: '70dvh',
    bgcolor: 'background.bg',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    px:'3vw',
    py: '3vh',
    mx:'auto',
    my: 'auto',
    // px: { xs: 2, sm: 4 },
    // py: { xs: 4, sm: 6 },
  }}
>
  <Card
    component={m.div}
    {...getVariant('fadeInRight')}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3,
      width: { xs: '100%', sm: '80dvw', md: '80dvw' },
      maxWidth: 800,
      textAlign: 'center',
      boxShadow: 3,
    }}
  >
    <Stack spacing={3} alignItems="center">
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <img
          src={PersonalGoalsImage}
          alt="Personal Goals"
          style={{ width: '100%', maxWidth: 400, height: 'auto', maxHeight: '40vh' }}
        />
      </Box>

      <Typography variant="h5" fontWeight={600}>
        Your verification has been successfully completed.
      </Typography>

      <Typography variant="body1" color="text.secondary">
        You will receive a Microsoft Teams meeting link via email along with your interview schedule and further instructions.
      </Typography>

      <Typography variant="h6" color="primary.main">
        All the best for your interview!
      </Typography>
    </Stack>
  </Card>
</Card>

    );
}
