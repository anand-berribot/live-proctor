import { useState, useEffect } from 'react';

const useLocalStorage = (key) => {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  });

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === key) {
        const newValue = event.newValue ? JSON.parse(event.newValue) : null;
        setValue(newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return value;
};

export default useLocalStorage;
