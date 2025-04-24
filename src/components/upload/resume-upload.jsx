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
import { MotionContainer, varBounce } from '../animate';
import { m } from 'framer-motion';

// ----------------------------------------------------------------------
// https://proctor.berribot.com/candidate/declaration?candidate_id=105&interview_id=503&room=mastermind&is_proctor=True&api_key=1&question_bank=False
// https://humanless.berribot.com/home/105/503/True/1/False

// https://api.berribot.com/api/v1/proctor/candidate/update_candidate
// https://api.berribot.com/api/v1/proctor/candidate/candidate_save_audio
// https://api.berribot.com/api/v1/proctor/humanless/resumeupload/candidate/105/session/503
const MAX_SIZE = 3 * 1024 * 1024; // 3MB
const ALLOWED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export default function Upload({
    cv,
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
    schedule,
    jd,
    ...other
}) {
    const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
        multiple,
        disabled,
        //      accept: ALLOWED_TYPES.join(','),
        // maxSize: MAX_SIZE,
        // onDrop: handleFileChange,
        ...other,
    });

    const hasFile = !!file && !multiple;

    const hasFiles = !!files && multiple && !!files.length;

    const hasError = isDragReject || !!error;

    const renderPlaceholder = (
        <MotionContainer sx={{ p: 2 }}>
            <Stack spacing={3} alignItems="center" justifyContent="center" flexWrap="wrap" >
                <Stack
                    component={m.div} variant={varBounce().in}
                    whileTap={{ scale: 1.1 }}
                    whileHover={{ scale: 1.1 }}
                    spacing={0.5} alignItems="center" sx={{ border: 'none', borderRadius: 2, p: 3, bgcolor: 'background.bg', width: schedule && '12rem' || jd && '10rem' }}>
                    <Iconify icon="eva:cloud-upload-fill" width={40} sx={{ color: 'gray' }} />
                    {jd && <Typography variant="body2">Upload JD</Typography>}
                    {cv && <Typography variant="body2">Resume Upload</Typography>}
                    {schedule && <Typography variant="body2">Upload Excel File</Typography>}
                    {/* <Typography variant="body2">{!schedule ? 'Resume Upload' : 'Upload File'}</Typography> */}
                </Stack>

                {/* <UploadIllustration sx={{ width: 1, maxWidth: 200 }} />
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
            </Stack> */}
            </Stack>
        </MotionContainer>
    );

    const renderSinglePreview = (
        <SingleFilePreview imgUrl={typeof file === 'string' ? file : file?.preview} />
    );

    const removeSinglePreview = !disabled && hasFile && onDelete && (
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
                <MultiFilePreview files={files} thumbnail={thumbnail} onRemove={onRemove} animate={true} cv={cv} sx={{ overflow: 'hidden', minWidth: '10rem' }} jd={jd}/>
            </Box>

            {/* <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
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
      </Stack> */}
        </>
    );

    return (
        <Box sx={{ width: 1, position: 'relative', ...sx }}>
            <Box
                {...getRootProps()}
                sx={{
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
                {/* {console.log(files,'ll',hasFile,files)} */}
                {/* {hasFile ?  renderPlaceholder : ''} */}
                {files == null ? renderPlaceholder : ''}
            </Box>

            {removeSinglePreview}

            {helperText && helperText}

            <RejectionFiles fileRejections={fileRejections} />

            {renderMultiPreview}
        </Box>
    );
}

Upload.propTypes = {
    disabled: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.object]),
    error: PropTypes.bool,
    file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    files: PropTypes.array,
    helperText: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.object]),
    multiple: PropTypes.bool,
    onDelete: PropTypes.func,
    onRemove: PropTypes.func,
    onRemoveAll: PropTypes.func,
    onUpload: PropTypes.func,
    sx: PropTypes.object,
    thumbnail: PropTypes.bool,
};

