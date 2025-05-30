import Masonry from '@mui/lab/Masonry';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import AlertTitle from '@mui/material/AlertTitle';

import { paths } from 'src/routes/paths';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ComponentHero from 'src/sections/_examples/component-hero';

import ComponentBlock from '../component-block';

// ----------------------------------------------------------------------

const COLORS = ['info', 'success', 'warning', 'error'];

// ----------------------------------------------------------------------

export default function AlertView() {
  return (
    <>
      <ComponentHero>
        <CustomBreadcrumbs
          heading="Alert"
          links={[
            {
              name: 'Components',
              href: paths.components,
            },
            { name: 'Alert' },
          ]}
          moreLink={['https://mui.com/components/alert']}
        />
      </ComponentHero>

      <Container sx={{ my: 10 }}>
        <Masonry columns={{ xs: 1, sm: 2 }} spacing={3}>
          <ComponentBlock title="Standard">
            {COLORS.map((color) => (
              <Alert key={color} severity={color} onClose={() => {}} sx={{ width: 1 }}>
                This is an {color} alert — check it out!
              </Alert>
            ))}
          </ComponentBlock>

          <ComponentBlock title="Filled">
            {COLORS.map((color) => (
              <Alert
                key={color}
                severity={color}
                variant="filled"
                onClose={() => {}}
                sx={{ width: 1 }}
              >
                This is an {color} alert — check it out!
              </Alert>
            ))}
          </ComponentBlock>

          <ComponentBlock title="Outlined">
            {COLORS.map((color) => (
              <Alert
                key={color}
                severity={color}
                variant="outlined"
                onClose={() => {}}
                sx={{ width: 1 }}
              >
                This is an {color} alert — check it out!
              </Alert>
            ))}
          </ComponentBlock>

          <ComponentBlock title="Description">
            {COLORS.map((color) => (
              <Alert key={color} severity={color} onClose={() => {}} sx={{ width: 1 }}>
                <AlertTitle sx={{ textTransform: 'capitalize' }}> {color} </AlertTitle>
                This is an {color} alert — <strong>check it out!</strong>
              </Alert>
            ))}
          </ComponentBlock>

          <ComponentBlock title="Actions">
            <Alert
              severity="info"
              sx={{ width: 1 }}
              action={
                <Button color="info" size="small" variant="soft">
                  Action
                </Button>
              }
            >
              This is an info alert — check it out!
            </Alert>

            <Alert
              severity="info"
              variant="filled"
              sx={{ width: 1 }}
              action={
                <>
                  <Button
                    color="inherit"
                    size="small"
                    variant="outlined"
                    sx={{
                      mr: 1,
                      border: (theme) => `1px solid ${alpha(theme.palette.common.white, 0.48)}`,
                    }}
                  >
                    Undo
                  </Button>

                  <Button
                    size="small"
                    color="info"
                    variant="contained"
                    sx={{
                      bgcolor: 'info.dark',
                    }}
                  >
                    Action
                  </Button>
                </>
              }
            >
              This is an info alert — check it out!
            </Alert>

            <Alert
              severity="info"
              variant="outlined"
              sx={{ width: 1 }}
              action={
                <>
                  <Button
                    color="info"
                    size="small"
                    variant="outlined"
                    sx={{
                      mr: 1,
                    }}
                  >
                    Undo
                  </Button>

                  <Button
                    color="info"
                    size="small"
                    variant="contained"
                    sx={{
                      bgcolor: 'info.dark',
                    }}
                  >
                    Action
                  </Button>
                </>
              }
            >
              This is an info alert — check it out!
            </Alert>
          </ComponentBlock>
        </Masonry>
      </Container>
    </>
  );
}
