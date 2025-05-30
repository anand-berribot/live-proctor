import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ComponentHero from 'src/sections/_examples/component-hero';

import ComponentBlock from '../component-block';

// ----------------------------------------------------------------------

const COLORS = ['default', 'primary', 'secondary', 'info', 'success', 'warning', 'error'];

// ----------------------------------------------------------------------

export default function LabelView() {
  return (
    <>
      <ComponentHero>
        <CustomBreadcrumbs
          heading="Label"
          links={[
            {
              name: 'Components',
              href: paths.components,
            },
            { name: 'Label' },
          ]}
        />
      </ComponentHero>

      <Container sx={{ my: 10 }}>
        <Stack spacing={3}>
          <ComponentBlock title="Filled">
            {COLORS.map((color) => (
              <Tooltip key={color} title={color}>
                <Label color={color} variant="filled">
                  {color}
                </Label>
              </Tooltip>
            ))}
          </ComponentBlock>

          <ComponentBlock title="Outlined">
            {COLORS.map((color) => (
              <Label key={color} color={color} variant="outlined">
                {color}
              </Label>
            ))}
          </ComponentBlock>

          <ComponentBlock title="Soft">
            {COLORS.map((color) => (
              <Label key={color} color={color} variant="soft">
                {color}
              </Label>
            ))}
          </ComponentBlock>

          <ComponentBlock title="With Icon">
            <Label
              variant="filled"
              color="primary"
              startIcon={<Iconify icon="fluent:mail-24-filled" />}
            >
              Start Icon
            </Label>

            <Label
              variant="filled"
              color="primary"
              endIcon={<Iconify icon="fluent:mail-24-filled" />}
            >
              End Icon
            </Label>

            <Label
              variant="outlined"
              color="primary"
              startIcon={<Iconify icon="fluent:mail-24-filled" />}
            >
              Start Icon
            </Label>

            <Label
              variant="outlined"
              color="primary"
              endIcon={<Iconify icon="fluent:mail-24-filled" />}
            >
              End Icon
            </Label>

            <Label color="primary" startIcon={<Iconify icon="fluent:mail-24-filled" />}>
              Start Icon
            </Label>

            <Label color="primary" endIcon={<Iconify icon="fluent:mail-24-filled" />}>
              End Icon
            </Label>
          </ComponentBlock>
        </Stack>
      </Container>
    </>
  );
}
