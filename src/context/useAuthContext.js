import { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './authContext';

// Custom hook to use Auth Context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  // console.log('context:', context);
  if (!context) throw new Error('useAuthContext must be used within an AuthProvider');
  return context;
};
