import Masonry from '@mui/lab/Masonry';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ComponentHero from 'src/sections/_examples/component-hero';

import FormDialog from './form-dialog';
import AlertDialog from './alert-dialog';
import ScrollDialog from './scroll-dialog';
import SimpleDialogs from './simple-dialog';
import MaxWidthDialog from './max-width-dialog';
import ComponentBlock from '../../component-block';
import FullScreenDialog from './full-screen-dialog';
import TransitionsDialog from './transitions-dialog';

// ----------------------------------------------------------------------

export default function DialogView() {
  return (
    <>
      <ComponentHero>
        <CustomBreadcrumbs
          heading="Dialog"
          links={[
            {
              name: 'Components',
              href: paths.components,
            },
            { name: 'Dialog' },
          ]}
          moreLink={['https://mui.com/components/dialogs']}
        />
      </ComponentHero>

      <Container sx={{ my: 10 }}>
        <Masonry columns={{ xs: 1, md: 3 }} spacing={3}>
          <ComponentBlock title="Simple">
            <SimpleDialogs />
          </ComponentBlock>

          <ComponentBlock title="Alerts">
            <AlertDialog />
          </ComponentBlock>

          <ComponentBlock title="Transitions">
            <TransitionsDialog />
          </ComponentBlock>

          <ComponentBlock title="Form">
            <FormDialog />
          </ComponentBlock>

          <ComponentBlock title="Full Screen">
            <FullScreenDialog />
          </ComponentBlock>

          <ComponentBlock title="Max Width Dialog">
            <MaxWidthDialog />
          </ComponentBlock>

          <ComponentBlock title="Scrolling Content Dialogs">
            <ScrollDialog />
          </ComponentBlock>
        </Masonry>
      </Container>
    </>
  );
}
