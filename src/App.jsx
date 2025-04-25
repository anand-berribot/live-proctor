// src/App.jsx

import { useState } from 'react';
import '../src/global.css'
import 'src/locales/i18n';
import ThemeProvider from './theme';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { SettingsDrawer, SettingsProvider } from './components/settings';
import { MotionLazy } from './components/animate/motion-lazy';
import { SnackbarProvider } from './components/snackbar';
import ProgressBar from './components/progress-bar';
import Router from './new-component/router';
import { LocalizationProvider } from './locales';
// import Router from './routes/sections';

function App() {

  return (
    <LocalizationProvider>
      <SettingsProvider
        defaultSettings={{
          themeMode: 'dark', // 'light' | 'dark'
          themeDirection: 'ltr', //  'rtl' | 'ltr'
          themeContrast: 'default', // 'default' | 'bold'
          themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
          themeColorPresets: 'default',// 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
          themeStretch: false,
        }}
      >
        <ThemeProvider>
          <MotionLazy>
            <SnackbarProvider>
              <ProgressBar />
              <SettingsDrawer />
              <Router />
            </SnackbarProvider>
          </MotionLazy>
        </ThemeProvider>
      </ SettingsProvider>
    </LocalizationProvider>
  );
}

export default App; 