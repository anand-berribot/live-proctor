import React, { useEffect } from 'react';
import { Box, Button, Card, CardContent, Grid, ListItemText, Stack } from '@mui/material';
import { m } from 'framer-motion';
import getVariant from 'src/sections/_examples/extra/animate-view/get-variant';
import { useMastermind } from '../../context/mastermind-context';
import { useNavigate } from 'react-router-dom';
import { useRouter } from 'src/routes/hooks';


export default function Hints({ }) {
  const router = useRouter();
  const { setCurrentPage } = useMastermind();
  const MASTERMIND_API_URL = process.env.VITE_REACT_APP_API_URL;


  const handleNextButtonClick = async () => {
    router.push('/identity-verification')
  };

  // Hints data
  const hints = [
    { icon: '/assets/new-icon/ic-solar_user-rounded-bold.svg', title: 'Tech Check', description: 'Ensure your internet, camera, and microphone are in working condition.' },
    { icon: '/assets/new-icon/ic-solar_microphone-bold.svg', title: 'Audio & Video Test', description: 'Double-check audio and video minutes before the interview.' },
    { icon: '/assets/new-icon/ic-solar_bell-bing-bold.svg', title: 'Quiet Setup', description: 'Find a distraction-free, well-lit space.' },
    { icon: '/assets/new-icon/ic-icon-park-outline_loading.svg', title: 'Limit Distractions', description: 'Silence notifications and close extra tabs/apps.' },
    { icon: '/assets/new-icon/ic-mingcute_flash-fill.svg', title: 'Good Lighting', description: 'Ensure your face is well-lit and the background is clutter-free.' },
    { icon: '/assets/new-icon/ic-solar_eye-closed-bold.svg', title: 'Eye Contact', description: 'Maintain eye contact with the camera.' },
  ];

  return (
    <>
      <Stack component={m.div} {...getVariant('fadeInRight')} sx={{ minWidth: 400 }}>
        <Stack component={Card} spacing={3} sx={{ pt: '3vh', pb: '3vh', pl: '3vw', pr: '3vw', m: 2, ml: 4, mr: 4, bgcolor: 'background.bg' }}>
          <ListItemText
            primary="Helpful Hints"
            secondary="Kindly attend the interview without background noise."
            primaryTypographyProps={{ typography: 'h6', mb: 0.5 }}
            secondaryTypographyProps={{ component: 'span' }}
          />
          <Grid item xs={12} md={8}>
            <Box
              gap={4}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
            >
              {hints.map((item, index) => (
                <Card key={index}>
                  <CardContent>
                    <Stack direction="column" alignItems="flex-start">
                      <img src={item.icon} alt={item.title} />
                      <Stack spacing={1}>
                        <ListItemText
                          sx={{ mt: 3, mb: 1 }}
                          primary={item.title}
                          secondary={item.description}
                          primaryTypographyProps={{ typography: 'subtitle1' }}
                          secondaryTypographyProps={{ component: 'span', mt: 0.5 }}
                        />
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Grid>
        </Stack>
        <Button
          variant="contained"
          color="primary"
          size="medium"
          sx={{
            ml: 'auto',
            mr: 3.5,
            width: 120,
            display: 'flex',
            flexDirection: 'row-reverse',
            borderRadius: 0.5,
            fontWeight: 500,
          }}
          onClick={handleNextButtonClick}
        >
          NEXT
        </Button>
      </Stack>
    </>
  );
}