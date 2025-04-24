import React from 'react';
import { styled } from '@mui/system';
import Box from '@mui/material/Box';


export const CustomScrollbar = styled(Box)({
  '&::-webkit-scrollbar': {
    borderRadius: '10px',
    width: '8px',
    height: '8px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#00A76F',
    // #00A76F
    // #007867
    // 0 8px 16px 0 rgba(0, 167, 111, 0.24)
    borderRadius: '10px',
    '&:hover': {
      // backgroundColor: '#555',
      backgroundColor: '#007867',
      boxShadow: '0 8px 16px 0 rgba(0, 167, 111, 0.24)',
    },
  },
  // '&::-webkit-scrollbar-thumb': {
  //   backgroundColor: '#888',
  //   // #00A76F
  //   // #007867
  //   // 0 8px 16px 0 rgba(0, 167, 111, 0.24)
  //   borderRadius: '10px',
  //   '&:hover': {
  //     backgroundColor: '#555',
  //   },
  // },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#f1f1f1',
    borderRadius: '10px',
  },
  overflowY: 'auto', // Ensure the Box is scrollable
  // maxHeight: '300px', // Adjust as needed
  padding: '10px',
});

export const CustomScrollbar1 = styled(Box)({
  '&::-webkit-scrollbar': {
    borderRadius: '10px',
    width: '8px',
    height: '8px',
    transition: 'opacity 0.2s ease', // Add transition for opacity
    opacity: 0.5, // Initially set a dim opacity
  },
  '&:hover::-webkit-scrollbar': {
    opacity: 1, // Show the scrollbar on hover
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#00A76F',
    borderRadius: '10px',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: '#007867',
      boxShadow: '0 8px 16px 0 rgba(0, 167, 111, 0.24)',
    },
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#f1f1f1',
    borderRadius: '10px',
  },
  overflow: 'auto',
  padding: '10px',
  // Hide the vertical scrollbar when not scrolling
  '&::-webkit-scrollbar-thumb:vertical': {
    opacity: 0.5,
  },
});
export const CustomScrollbar2 = styled(Box)({
  overflowY: 'auto',
  scrollbarWidth: 'thin',

  '&::-webkit-scrollbar': {
    borderRadius: '10px',
    width: '8px',
    transition: 'opacity 0.2s ease', // Add transition for opacity
    opacity: 0.5, // Initially set a dim opacity
  },
  '&::-webkit-scrollbar-track': {
    opacity: 1,
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#888',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: '#555',
  },
})

// console.log(theme);
export const CustomScrollbar4 = styled(Box)({
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&:hover::-webkit-scrollbar-track': {
    // background: '#f1f1f1', // Color of the track on hover
    background: 'transparent', // Color of the track on hover
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'primary',
    // backgroundColor: theme.palette.scroll.thumb,
    borderRadius: '10px',
    border: '2px solid transparent', // Add padding around the thumb
    backgroundClip: 'content-box', // Show the padding as a gap around the thumb
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: 'primary',
    // backgroundColor: theme.palette.scroll.active,
    opacity: 0.8,
  },
  '&::-webkit-scrollbar-corner': {
    background: 'transparent',
  },
})