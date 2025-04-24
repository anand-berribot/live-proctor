import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { UploadIllustration } from 'src/assets/illustrations';

import Iconify from '../iconify';
import MultiFilePreview from './preview-multi-file';
import RejectionFiles from './errors-rejection-files';
import SingleFilePreview from './preview-single-file';
import { Link } from '@mui/material';

// ----------------------------------------------------------------------

export default function Upload({
  candidate,
  disabled,
  multiple = false,
  error,
  helperText,
  //
  file,
  onDelete,
  //
  files,
  thumbnail,
  onUpload,
  onRemove,
  onRemoveAll,
  sx,
  ...other
}) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple,
    disabled,
    ...other,
  });

  const hasFile = !!file && !multiple;

  const hasFiles = !!files && multiple && !!files.length;

  const hasError = isDragReject || !!error;
  const renderPlaceholder1 = (
    <Stack spacing={1} alignItems="center" justifyContent="center" flexWrap="wrap" sx={{ mt: -2, mb: 3 }}>
      {candidate ?
        <img src='/assets/new-icon/id-card.svg' alt='id-card' style={{ width: 240, maxWidth: 240 }} />
        : <UploadIllustration sx={{ width: 1, maxWidth: 200 }} />
      }
      <Stack spacing={0} sx={{ textAlign: 'center' }}>
        <Typography variant="body2">Drop or Select file</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Drop files here or click
          <Box
            component="span"
            sx={{
              mx: 0.5,
              color: 'primary.main',
              textDecoration: 'underline',
            }}
          >
            browse
          </Box>
          through your machine
        </Typography>
      </Stack>
    </Stack>
  );
  const renderPlaceholder = (
    <Stack spacing={3} alignItems="center" justifyContent="center" flexWrap="wrap">
      <UploadIllustration sx={{ width: 1, maxWidth: 200 }} />
      <Stack spacing={1} sx={{ textAlign: 'center' }}>
        <Typography variant="h6">Drop or Select file</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Drop files here or click
          <Box
            component="span"
            sx={{
              mx: 0.5,
              color: 'primary.main',
              textDecoration: 'underline',
            }}
          >
            browse
          </Box>
          through your machine
        </Typography>
      </Stack>
    </Stack>
  );
  const renderSinglePreview1 = (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', position: 'relative' }}>
      <Box sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        <img src={typeof file === 'string' ? file : file?.preview} style={{
          maxWidth: '100%',
          maxHeight: '100%',
          width: 'auto',
          height: 'auto',
          display: 'block',
          objectFit: 'contain',
          position: 'relative',
          borderRadius: '10px'
        }} />
        {/* <IconButton
          size="small"
          onClick={onDelete}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 9,
            color: (theme) => alpha(theme.palette.common.white, 0.8),
            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
            },
          }}
        >
          <Iconify icon="mingcute:close-line" width={18} />
        </IconButton> */}
      </Box>
    </Box>





  )
  const renderSinglePreview2 = (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
      <Box sx={{
        position: 'relative',
        borderRadius: 4, width: '100%', height: '100%'
      }}>
        <img src={typeof file === 'string' ? file : file?.preview} style={{
          maxWidth: '100%',
          maxHeight: '100%',
          width: 'auto',
          height: 'auto',
          display: 'block',
          margin: 'auto',
          position: 'relative'
        }} />
        <IconButton
          size="small"
          onClick={onDelete}
          sx={{
            top: 16,
            right: 16,
            zIndex: 9,
            position: 'absolute',
            color: (theme) => alpha(theme.palette.common.white, 0.8),
            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
            },
          }}
        >
          <Iconify icon="mingcute:close-line" width={18} />
        </IconButton>
      </Box>

    </Box>)

  const renderSinglePreview = (
    <SingleFilePreview imgUrl={typeof file === 'string' ? file : file?.preview} candidate={candidate} />
  );

  const removeSinglePreview = hasFile && onDelete && (
    <IconButton
      size="small"
      onClick={onDelete}
      sx={{
        top: 16,
        right: 16,
        zIndex: 9,
        position: 'absolute',
        color: (theme) => alpha(theme.palette.common.white, 0.8),
        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
        '&:hover': {
          bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
        },
      }}
    >
      <Iconify icon="mingcute:close-line" width={18} />
    </IconButton>
  );

  const renderMultiPreview = hasFiles && (
    <>
      <Box sx={{ my: 3 }}>
        <MultiFilePreview files={files} thumbnail={thumbnail} onRemove={onRemove} />
      </Box>

      <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
        {onRemoveAll && (
          <Button color="inherit" variant="outlined" size="small" onClick={onRemoveAll}>
            Remove All
          </Button>
        )}

        {onUpload && (
          <Button
            size="small"
            variant="contained"
            onClick={onUpload}
            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
          >
            Upload
          </Button>
        )}
      </Stack>
    </>
  );

  return (
    <Box sx={candidate ? { width: '100%', height: '100%', textAlign: 'center', display: 'contents' } : { width: 1, position: 'relative', ...sx }}>
      <Box
        {...getRootProps()}
        //  {...getRootProps()}
        sx={candidate ? {
          outline: 'none',
          borderRadius: 1,
          cursor: 'pointer',
          width: '100%',
          height: '100%',
          transition: (theme) => theme.transitions.create(['opacity', 'padding']),
          '&:hover': {
            opacity: 0.72,
          },
          ...(isDragActive && {
            opacity: 0.72,
          }),
          ...(disabled && {
            opacity: 0.48,
            pointerEvents: 'none',
          }),
          ...(hasError && {
            color: 'error.main',
            borderColor: 'error.main',
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
          }),
          // ...(hasFile && {
          //   padding: '24% 0',
          // }),
        } : {
          // p: 5,
          outline: 'none',
          borderRadius: 1,
          cursor: 'pointer',
          overflow: 'hidden',
          position: 'relative',
          // bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
          // border: (theme) => `1px dashed ${alpha(theme.palette.grey[500], 0.2)}`,
          transition: (theme) => theme.transitions.create(['opacity', 'padding']),
          '&:hover': {
            opacity: 0.72,
          },
          ...(isDragActive && {
            opacity: 0.72,
          }),
          ...(disabled && {
            opacity: 0.48,
            pointerEvents: 'none',
          }),
          ...(hasError && {
            color: 'error.main',
            borderColor: 'error.main',
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
          }),
          ...(hasFile && {
            padding: '24% 0',
          }),

        }}
      >
        <input {...getInputProps()} />

        {hasFile ? (candidate ? renderSinglePreview1 : renderSinglePreview) : (candidate ? renderPlaceholder1 : renderPlaceholder)}
      </Box>
      {
        !disabled && candidate && hasFile && <Link type="button" variant="contained"
          {...getRootProps()}
          sx={{
            fontSize: 15, cursor: 'pointer', textDecoration: 'underline',
            position: 'absolute', bottom: 12,
            ':hover': { textDecoration: 'none' }
          }}>Click here to Reupload Front side of ID</Link>
      }
      {!disabled && !candidate && removeSinglePreview}

      {helperText && helperText}

      <RejectionFiles fileRejections={fileRejections} />

      {renderMultiPreview}
    </Box >
  );
}

Upload.propTypes = {
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  error: PropTypes.bool,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  files: PropTypes.array,
  helperText: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  multiple: PropTypes.bool,
  onDelete: PropTypes.func,
  onRemove: PropTypes.func,
  onRemoveAll: PropTypes.func,
  onUpload: PropTypes.func,
  sx: PropTypes.object,
  thumbnail: PropTypes.bool,
};
