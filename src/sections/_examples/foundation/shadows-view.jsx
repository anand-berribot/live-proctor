import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ComponentHero from 'src/sections/_examples/component-hero';

import ComponentBlock from '../component-block';

// ----------------------------------------------------------------------

export default function ShadowsView() {
  const theme = useTheme();

  const systemShadows = theme.shadows.slice(1, theme.shadows.length);

  const customShadows = [
    ['z1', theme.customShadows.z1],
    ['z4', theme.customShadows.z4],
    ['z8', theme.customShadows.z8],
    ['z12', theme.customShadows.z12],
    ['z16', theme.customShadows.z16],
    ['z20', theme.customShadows.z20],
    ['z24', theme.customShadows.z24],
    ['card', theme.customShadows.card],
    ['dropdown', theme.customShadows.dropdown],
    ['dialog', theme.customShadows.dialog],
  ];

  const colorShadows = ['primary', 'secondary', 'info', 'success', 'warning', 'error'];

  return (
    <>
      <ComponentHero>
        <CustomBreadcrumbs
          heading="Shadows"
          links={[
            {
              name: 'Components',
              href: paths.components,
            },
            { name: 'Shadows' },
          ]}
        />
      </ComponentHero>

      <Container sx={{ my: 10 }}>
        <Stack spacing={5}>
          <ComponentBlock title="System">
            {systemShadows.map((shadow, index) => (
              <ShadowCard key={shadow} title={`z${index + 1}`} sx={{ boxShadow: shadow }} />
            ))}
          </ComponentBlock>

          <ComponentBlock title="Customs">
            {customShadows.map((shadow) => (
              <ShadowCard key={shadow[0]} title={shadow[0]} sx={{ boxShadow: shadow[1] }} />
            ))}
          </ComponentBlock>

          <ComponentBlock title="Colors">
            {colorShadows.map((color) => (
              <ShadowCard
                key={color}
                title={color}
                sx={{
                  color: theme.palette[color].contrastText,
                  bgcolor: theme.palette[color].main,
                  boxShadow: theme.customShadows[color],
                }}
              />
            ))}
          </ComponentBlock>
        </Stack>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

function ShadowCard({ sx, title }) {
  return (
    <Paper
      sx={{
        padding: 3,
        margin: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: {
          xs: 'calc((100%/2) - 24px)',
          sm: 'calc((100%/4) - 24px)',
          md: 'calc((100%/6) - 24px)',
        },
        ...sx,
      }}
    >
      <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
        {title}
      </Typography>
    </Paper>
  );
}

ShadowCard.propTypes = {
  sx: PropTypes.object,
  title: PropTypes.string,
};
