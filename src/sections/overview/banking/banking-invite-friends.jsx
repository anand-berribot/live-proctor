import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

import { bgGradient } from 'src/theme/css';

// ----------------------------------------------------------------------

export default function BankingInviteFriends({ img, price, title, description, sx, ...other }) {
  const theme = useTheme();

  return (
    <Box {...other}>
      <Box
        component="img"
        alt="invite"
        src={img}
        sx={{
          left: 40,
          zIndex: 9,
          width: 140,
          position: 'relative',
          filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.24))',
          ...sx,
        }}
      />

      <Box
        sx={{
          mt: -15,
          color: 'common.white',
          borderRadius: 2,
          p: theme.spacing(16, 5, 5, 5),
          ...bgGradient({
            direction: '135deg',
            startColor: theme.palette.primary.main,
            endColor: theme.palette.primary.dark,
          }),
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box sx={{ whiteSpace: 'pre-line', typography: 'h4' }}>{title}</Box>
          <Box sx={{ typography: 'h2' }}>{price}</Box>
        </Stack>

        <Box sx={{ mt: 2, mb: 3, typography: 'body2' }}>{description}</Box>

        <InputBase
          fullWidth
          placeholder="Email"
          endAdornment={
            <Button color="warning" variant="contained" size="small" sx={{ mr: 0.5 }}>
              Invite
            </Button>
          }
          sx={{
            pl: 1.5,
            height: 40,
            borderRadius: 1,
            bgcolor: 'common.white',
          }}
        />
      </Box>
    </Box>
  );
}

BankingInviteFriends.propTypes = {
  description: PropTypes.string,
  img: PropTypes.string,
  price: PropTypes.string,
  sx: PropTypes.object,
  title: PropTypes.string,
};
