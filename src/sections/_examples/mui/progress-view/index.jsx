import { useRef, useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ComponentHero from 'src/sections/_examples/component-hero';

import ProgressLinear from './progress-linear';
import ProgressCircular from './progress-circular';
import ComponentBlock from '../../component-block';

// ----------------------------------------------------------------------

export default function ProgressView() {
  const [progress, setProgress] = useState(0);

  const [buffer, setBuffer] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const progressRef = useRef(() => {});

  useEffect(() => {
    progressRef.current = () => {
      if (progress > 100) {
        setProgress(0);
        setBuffer(10);
      } else {
        const diff = Math.random() * 10;
        const diff2 = Math.random() * 10;
        setProgress(progress + diff);
        setBuffer(progress + diff + diff2);
      }
    };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      progressRef.current();
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      <ComponentHero>
        <CustomBreadcrumbs
          heading="Progress"
          links={[
            {
              name: 'Components',
              href: paths.components,
            },
            { name: 'Progress' },
          ]}
          moreLink={['https://mui.com/components/progress']}
        />
      </ComponentHero>

      <Container sx={{ my: 10 }}>
        <Stack spacing={5}>
          <ComponentBlock title="Circular">
            <ProgressCircular progress={progress} />
          </ComponentBlock>

          <ComponentBlock title="Linear">
            <ProgressLinear progress={progress} buffer={buffer} />
          </ComponentBlock>
        </Stack>
      </Container>
    </>
  );
}
