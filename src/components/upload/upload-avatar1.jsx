import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import Image from '../image';
import Iconify from '../iconify';
import RejectionFiles from './errors-rejection-files';
import { Button } from '@mui/material';
import { varHover } from '../animate';
import { m } from 'framer-motion';
import zIndex from '@mui/material/styles/zIndex';

// ----------------------------------------------------------------------

export default function UploadAvatar1({ error, file, disabled, helperText, sx, smProfile, onRemove, ...other }) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple: false,
    disabled,
    accept: {
      'image/*': [],
    },
    ...other,
    smProfile: false
  });

  const hasFile = !!file;

  const hasError = isDragReject || !!error;

  const imgUrl = typeof file === 'string' ? file : file?.preview;

  const renderPreview = hasFile && (
    <Image
      alt="avatar"
      src={imgUrl}
      sx={{
        width: 1,
        height: 1,
        borderRadius: '50%',
      }}
    />
  );

  const renderPlaceholder = (
    <Stack

      alignItems="center"
      justifyContent="center"
      spacing={1}
      className="upload-placeholder"
      sx={{
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        zIndex: 9,
        borderRadius: '50%',
        position: 'absolute',
        color: 'text.disabled',
        // bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.3),

        transition: (theme) =>
          theme.transitions.create(['opacity'], {
            duration: theme.transitions.duration.shorter,
          }),
        // '&:hover': {
        //   opacity: 0.72,
        // },
        ...(hasError && {
          color: 'error.main',
          bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
        }),
        ...(hasFile && {
          zIndex: 9,
          opacity: 0,
          color: 'common.white',
          bgcolor: (theme) => alpha(theme.palette.grey[900], 0.64),
        }),
      }}
    >
      {/* <Iconify icon="solar:camera-add-bold" width={32} /> */}

      <Button
        {...getRootProps()}
        variant="contained"
        color='text'
        component={m.Button}
        whileHover="hover"
        whileTap="tap"
        variants={varHover(1.01, 1)}
        sx={{
          bgcolor: '#F9F9F9',
          border: '1px solid #C8C8C8',
          borderRadius: '4px',
          color: 'common.black', fontSize: '0.7rem', p: 0.6, fontWeight: 600,

        }} >{file ? 'Update photo' : 'Upload photo'}</Button>
    </Stack>
  );

  const renderContent = (
    <Box
      sx={{
        width: 1,
        height: 1,
        overflow: 'hidden',
        borderRadius: '50%',
        position: 'relative',
      }}
    >
      {console.log('has', hasFile)}
      {renderPreview}
      {!hasFile && renderPlaceholder}
      {/* {hasFile &&
        <Box sx={{ position: 'relative', mt: -3 }}> <Button

          {...getRootProps()}
          variant="contained"
          color='text'
          component={m.Button}
          whileHover="hover"
          whileTap="tap"
          variants={varHover(1.01, 1)}
          sx={{
            bgcolor: 'common.white', color: 'common.black', fontSize: '0.7rem', p: 0.6, fontWeight: 600,
            // position: 'absolute',
            zIndex: '99 !important',
            // top: 20,

          }} >{file ? 'Update photo' : 'Upload photo'}</Button></Box>} */}
    </Box>
  );

  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <Box
          // {...getRootProps()}
          sx={{
            p: 1,
            m: !smProfile && 'auto',
            width: 144,
            height: 144,
            cursor: 'pointer',
            overflow: 'hidden',
            borderRadius: '50%',
            border: (theme) => `1px dashed ${alpha(theme.palette.grey[500], 0.2)}`,
            ...(isDragActive && {
              opacity: 0.72,
            }),
            ...(disabled && {
              opacity: 0.48,
              pointerEvents: 'none',
            }),
            ...(hasError && {
              borderColor: 'error.main',
            }),
            ...(hasFile && {
              ...(hasError && {
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
              }),
              '&:hover .upload-placeholder': {
                opacity: 1,
              },
            }),
            ...sx,
          }}
        >
          <input {...getInputProps()} />

          {renderContent}

        </Box>
        {hasFile &&
          <Box sx={{ position: 'relative', mt: -3 }}> <Button

            {...getRootProps()}
            variant="contained"
            color='text'
            component={m.Button}
            whileHover="hover"
            whileTap="tap"
            variants={varHover(1.01, 1)}
            onClick={() => onRemove()}
            sx={{
              bgcolor: '#F9F9F9', color: 'common.black', fontSize: '0.7rem', p: 0.6, fontWeight: 600,
              left: "28px",
              border: '1px solid #C8C8C8',
              borderRadius: '4px'
              // position: 'absolute',
              // zIndex: '99 !important',
              // top: 20,

            }} >{'Remove Photo'}</Button></Box>}
      </Box>

      {!hasFile && helperText && helperText}

      <RejectionFiles fileRejections={fileRejections} />
    </>
  );
}

UploadAvatar1.propTypes = {
  disabled: PropTypes.object,
  error: PropTypes.bool,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  helperText: PropTypes.object,
  sx: PropTypes.object,
};
