import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme, hexToRgb } from '@mui/material/styles';

import { paths } from 'src/routes/paths';

import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

import { useSnackbar } from 'src/components/snackbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ComponentHero from 'src/sections/_examples/component-hero';

// ----------------------------------------------------------------------

const PALETTE = ['primary', 'secondary', 'info', 'success', 'warning', 'error'];

const VARIATIONS = ['lighter', 'light', 'main', 'dark', 'darker'];

const GREY = ['100', '200', '300', '400', '500', '600', '700', '800', '900'];

// ----------------------------------------------------------------------

export default function ColorsView() {
  const theme = useTheme();

  const { enqueueSnackbar } = useSnackbar();

  const { copy } = useCopyToClipboard();

  const onCopy = (color) => {
    if (color) {
      enqueueSnackbar(`Copied! ${color}`);
      copy(color);
    }
  };

  return (
    <>
      <ComponentHero>
        <CustomBreadcrumbs
          heading="Color"
          links={[
            {
              name: 'Components',
              href: paths.components,
            },
            { name: 'Color' },
          ]}
          moreLink={['https://mui.com/customization/color', 'https://colors.eva.design']}
        />
      </ComponentHero>

      <Container sx={{ my: 10 }}>
        <Box
          gap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          }}
        >
          {PALETTE.map((color) => (
            <Stack
              key={color}
              sx={{
                borderRadius: 1,
                overflow: 'hidden',
                boxShadow: theme.customShadows.card,
              }}
            >
              <Typography variant="h5" sx={{ textTransform: 'capitalize', p: 2.5, pb: 0 }}>
                {color}
              </Typography>

              <Stack spacing={1} sx={{ p: 2.5 }}>
                {VARIATIONS.map((variation) => (
                  <ColorCard
                    key={variation}
                    variation={variation}
                    hexColor={theme.palette[color][variation]}
                    onCopy={() => onCopy(theme.palette[color][variation])}
                  />
                ))}
              </Stack>
            </Stack>
          ))}

          <Stack
            sx={{
              borderRadius: 1,
              overflow: 'hidden',
              boxShadow: theme.customShadows.card,
            }}
          >
            <Typography variant="h5" sx={{ textTransform: 'capitalize', p: 2.5, pb: 0 }}>
              Grey
            </Typography>

            <Stack spacing={1} sx={{ p: 2.5 }}>
              {GREY.map((variation) => (
                <ColorCard
                  key={variation}
                  variation={variation}
                  hexColor={theme.palette.grey[variation]}
                  onCopy={() => onCopy(theme.palette.grey[variation])}
                />
              ))}
            </Stack>
          </Stack>
        </Box>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

function ColorCard({ hexColor, variation, onCopy }) {
  return (
    <Stack
      spacing={1}
      onClick={onCopy}
      sx={{
        px: 2,
        py: 1.5,
        borderRadius: 1,
        cursor: 'pointer',
        overflow: 'hidden',
        position: 'relative',
        bgcolor: hexColor,
        color: (theme) => theme.palette.getContrastText(hexColor),
        border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.08)}`,
        transition: (theme) =>
          theme.transitions.create(['background-color'], {
            duration: theme.transitions.duration.shorter,
          }),
        '&:hover': {
          bgcolor: alpha(hexColor, 0.8),
        },
      }}
    >
      <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
        {variation}
      </Typography>

      <Box
        gap={2.5}
        display="grid"
        gridTemplateColumns="repeat(2, 1fr)"
        sx={{ typography: 'caption' }}
      >
        <Box>
          <Box component="span">Hex </Box>
          {hexColor}
        </Box>

        <Box>
          <Box component="span">Rgb </Box>
          {hexToRgb(hexColor).replace('rgb(', '').replace(')', '')}
        </Box>
      </Box>
    </Stack>
  );
}

ColorCard.propTypes = {
  onCopy: PropTypes.func,
  hexColor: PropTypes.string,
  variation: PropTypes.string,
};
