import React, { useState, useEffect } from 'react';
import { Typography, Box, Card, Grid, Paper } from '@mui/material';
import moment from 'moment';
import { useMastermind } from 'src/context/mastermind-context';

const timeUnitStyles = {
  paper: {
    width: '6rem',
    height: '6rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    p: 3,
    m: 2,
    bgcolor: 'background.default',
    minHeight: '77vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
};

const CountdownToInterviewStart = () => {
  const { setCurrentPage, candidateData } = useMastermind();
  
  // Validate and get interview data
  const interview = candidateData?.Interviews?.[0];
  if (!interview) {
    console.error('[CountdownToInterviewStart] No interview data found');
    return null;
  }

  // Parse dates with validation
  const targetDate = moment(interview.scheduled_at_str);
  const endDate = moment(interview.scheduled_end_at_str);
  
  if (!targetDate.isValid() || !endDate.isValid()) {
    console.error('[CountdownToInterviewStart] Invalid date format', {
      scheduled_at_str: interview.scheduled_at_str,
      scheduled_end_at_str: interview.scheduled_end_at_str
    });
    return null;
  }

  const calculateTimeLeft = (target) => {
    const now = moment();
    const difference = target.diff(now);

    if (difference <= 0) return null;

    return {
      days: Math.floor(moment.duration(difference).asDays()),
      hours: moment.duration(difference).hours(),
      minutes: moment.duration(difference).minutes(),
      seconds: moment.duration(difference).seconds(),
    };
  };

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));
  const [status, setStatus] = useState('counting'); // 'counting' | 'expired' | 'redirecting'

  useEffect(() => {
    console.debug(`[CountdownToInterviewStart] Countdown initialized`, {
      targetDate: targetDate.format(),
      endDate: endDate.format()
    });

    const timer = setInterval(() => {
      const now = moment();
      
      if (now.isSameOrAfter(endDate)) {
        console.info('[CountdownToInterviewStart] Interview time window has ended');
        setStatus('expired');
        clearInterval(timer);
        return;
      }

      if (now.isSameOrAfter(targetDate)) {
        console.info('[CountdownToInterviewStart] Interview start time reached - redirecting');
        setStatus('redirecting');
        clearInterval(timer);
        setCurrentPage('TECHNICAL_READINESS_CHECK');
        return;
      }

      const newTimeLeft = calculateTimeLeft(targetDate);
      setTimeLeft(newTimeLeft);
      console.debug('[CountdownToInterviewStart] Countdown update', newTimeLeft);
    }, 1000);

    return () => {
      console.debug('[CountdownToInterviewStart] Cleaning up timer');
      clearInterval(timer);
    };
  }, [targetDate, endDate, setCurrentPage]);

  if (status !== 'counting') {
    return null;
  }

  const units = ['days', 'hours', 'minutes', 'seconds'];
  const timeLeftValues = units.map((unit) => timeLeft?.[unit] || 0);
  const firstNonZeroIndex = timeLeftValues.findIndex((val) => val > 0);
  const displayUnits = firstNonZeroIndex >= 0 ? units.slice(firstNonZeroIndex) : units;

  if (!timeLeft) {
    console.warn('[CountdownToInterviewStart] No time left calculated - possible time calculation error');
    return null;
  }

  return (
    <Card sx={timeUnitStyles.card}>
      <Typography variant="h4" align="center" sx={{ mt: 3, mb: 5 }}>
        Get ready! Your Gen AI interview kicks off in
      </Typography>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        {displayUnits.map((unit) => (
          <Grid item key={unit} textAlign="center">
            <Paper elevation={3} sx={timeUnitStyles.paper}>
              <Typography variant="h2">
                {String(timeLeft[unit]).padStart(2, '0')}
              </Typography>
              <Typography variant="subtitle1">
                {unit.charAt(0).toUpperCase() + unit.slice(1)}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

export default CountdownToInterviewStart;