import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, useRoutes, Navigate, Outlet } from 'react-router-dom';
import { SplashScreen } from 'src/components/loading-screen';
import SimpleLayout from './layouts/simple';
import { CandidateExpProvider } from 'src/context/candidate-exp-context/candidateExpContext';
import Hints from 'src/pages/proctor/hints';
import IdentityVerification from 'src/pages/proctor/IdentityVerification';
import AudioVideo from 'src/pages/proctor/AudioVideo';
import { MastermindProvider } from 'src/context/mastermind-context';

// Lazy-loaded components
const HomePage = lazy(() => import('src/pages/Home'));
const Page404 = lazy(() => import('src/pages/error/404'));

// Routes
const homeRoutes = [
  {
    path: '/',
    element: (
      <CandidateExpProvider>
        <MastermindProvider>
          <SimpleLayout>
            <Suspense fallback={<SplashScreen />}>
              <Outlet />
            </Suspense>
          </SimpleLayout>
        </MastermindProvider>
      </CandidateExpProvider>
    ),
    children: [
      // { path: ':accesskey', element: <HomePage /> },
      { path: 'instructions', element: <Hints /> },
      { path: 'identity-verification', element: <IdentityVerification /> },
      { path: 'audio-video-verification', element: <AudioVideo /> },
    ],
  },
  { path: '*', element: <Navigate to="/404" replace /> },
  { path: '404', element: <Suspense fallback={<SplashScreen />}><Page404 /></Suspense> },
];


export default function AppRouter() {
  return (
    <Suspense fallback={<SplashScreen />}>
      {useRoutes([
        ...homeRoutes,
      ])}
    </Suspense>
  );
}
