import { m } from 'framer-motion';
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, FormControl, Select, InputLabel, IconButton, Paper, List, ListItem, ListItemText, ListItemIcon, Divider, Stack, MenuItem, Checkbox, Chip } from '@mui/material';
import getVariant from 'src/sections/_examples/extra/animate-view/get-variant';
import Iconify from 'src/components/iconify';
import bot_listening from 'src/assets/mastermind_animation/Listening_Transparent.webm';
import bot_berry from 'src/assets/mastermind_animation/Berry_Transparent.webm';
import { varFade, varZoom } from 'src/components/animate';
import { Icon } from '@iconify/react';
import SvgColor from 'src/components/svg-color';


export const ConfirmationDialog = ({ open, onClose, dialog, variant, dialog2, icon, title, count }) => {
    return (
        <Dialog open={open}
            textAlign="center"
            // onClose={onClose(fa)}
            sx={{ textAlign: 'center' }}
        >
            <React.Fragment component={m.div}
                {...getVariant(variant)}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent sx={{ textAlign: 'center' }}>

                    <Typography variant="body1">{dialog}</Typography>

                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' onClick={() => onClose(true)} color="primary">
                        Agree
                    </Button>
                    <Button variant='outlined' onClick={() => onClose(false)} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </React.Fragment>
        </Dialog>
    );
};

export const WarningDialog = ({ open, onClose, title, content, onConfirm, audioAlert, warning, onclosebutton }) => {
    // const count = Number(sessionStorage.getItem("UserTabChangeCount"));
    // const item = { icon: "fluent:document-pdf-24-filled", title: `Warning! ${count}` };

    return (
        <Dialog
            open={open}
            textAlign="center"
            onClose={onClose}
            sx={{ overflow: 'hidden', '& .MuiDialog-paper': { overflow: 'hidden', maxWidth: 'sm', width: '100%' } }}
            onContextMenu={(event) => event.preventDefault()}
        >
            <Box component={m.div}
                {...getVariant('bounceIn')}
                display="flex" justifyContent="center" alignItems="center" flexDirection={'column'} spacing={2}
                sx={{ m: 3, overflow: 'hidden' }}
            >

                <img src={'/assets/new-icon/warning.svg'} alt="warning" style={{ width: 100, height: 100, marginTop: '-4%' }} />
                <Typography variant='h5'>{warning ? `${title}` : title}</Typography>

                <Typography variant='body1' sx={{ p: 2, textAlign: 'center', fontWeight: 'bold' }}>
                    {content}
                </Typography>
                {onclosebutton !== 'true' &&
                    <Button onClick={() => warning ? onClose() : onConfirm()}
                        // color="primary" variant='outlined' 
                        variant='contained'
                        sx={{}}>
                        Ok
                    </Button>
                }
            </Box>
        </Dialog>
    )
}
export const SuccessDialog = ({ open, onClose, title, content, onConfirm }) => {
    // const count = Number(localStorage.getItem("UserTabChangeCount"));
    // const item = { icon: "fluent:document-pdf-24-filled", title: `Warning! ${count}` };

    return (
        <Dialog
            open={open}
            textAlign="center"
            onClose={onClose}
        // sx={{ overflow: 'hidden' }}
        >
            <IconButton
                onClick={onClose}

                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 20,
                    // color: (theme) => theme.palette.grey[500],
                }}
            >
                <Iconify icon="mingcute:close-line" />
            </IconButton>
            <DialogTitle sx={{ mr: 5, mt: 1 }}><span style={{ display: 'inline-block', position: 'relative', width: 30, marginRight: 5 }} > <img src='/assets/new-icon/success-tick.svg' alt="success" style={{ position: 'absolute', top: -18 }} /></span>{title}</DialogTitle>
            <Box
                display="flex" justifyContent="center" alignItems="center" flexDirection={'column'} spacing={2}
            //  p={3}
            >
                {/* <Box sx={{ m: 2 }}
            
            >
              
                {title}</Box> */}

                {/* <Box component={m.div}
                // {...(warning ? getVariant('bounceIn') : {})}
                display="flex" justifyContent="center" alignItems="center" flexDirection={'column'} spacing={2}
                sx={{ m: warning ? 4 : 2, overflow: 'hidden' }}
            >
                <img src={'/assets/new-icon/warning.svg'} alt="warning" style={{ width: 100, height: 100, marginTop: '-4%' }} />
                <Typography variant={warning ? 'h5' : 'h6'}>{title}</Typography>

                <Typography variant='body1' sx={{ p: 2, textAlign: 'center' }}>
                    {content}
                </Typography>
                <Button onClick={() => audioAlert ? onConfirm() : onClose()}
                    // color="primary" variant='outlined' 
                    variant='contained'
                    sx={{}}>
                    Ok
                </Button>
            </Box> */}
                <Box sx={{ m: 3, mt: 1, justifyContent: 'flex-end' }}>
                    <Button onClick={onClose} variant='contained'>
                        Ok
                    </Button>
                </Box>
            </Box>
        </Dialog>
    )
}

export const MultiTopicsDialog = ({ open, onClose, subTopicsData, setSelectedSubTopicValues }) => {
    const [selectedValues, setSelectedValues] = useState({ all_courses: {} });
    const [isSelectOpen, setIsSelectOpen] = useState(false);

    const handleConfirm = () => {
        setSelectedSubTopicValues(selectedValues);
        onClose(true);
    };



    const handleChange = (event) => {
        const selectedKeys = event.target.value;

        // Ensure 1 or 2 items are selected
        if (selectedKeys.length <= 2) {
            const newSelected = {
                all_courses: selectedKeys.reduce((acc, key) => {
                    acc[key] = subTopicsData.sub_topics.all_courses[key];
                    return acc;
                }, {}),
            };
            setSelectedValues(newSelected);
            setIsSelectOpen(false); // Close dropdown after selection

        }
    };

    // Updated to allow 1 or 2 selections
    const isSelectionValid = Object.keys(selectedValues.all_courses).length >= 1;

    return (
        <Dialog
            open={open}
            onClose={() => onClose(false)}
            maxWidth="sm"
            fullWidth
            sx={{ textAlign: 'center', p: 3 }}
        >
            <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', pb: 2 }}>
                Select Your Areas of Expertise
            </DialogTitle>

            <DialogContent sx={{ textAlign: 'center', pb: 3 }}>
                <Typography variant="body2" sx={{ mb: 3 }}>
                    Choose one or two areas of expertise to ensure the interview is tailored to your strengths.
                </Typography>

                <FormControl fullWidth>
                    <InputLabel id="multi-select-courses-label">Courses</InputLabel>
                    <Select
                        labelId="expertise-areas-label"
                        multiple
                        open={isSelectOpen}
                        onOpen={() => setIsSelectOpen(true)}
                        onClose={() => setIsSelectOpen(false)}
                        value={Object.keys(selectedValues.all_courses)}
                        onChange={handleChange}
                        label="Areas of Expertise"
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                            </Box>
                        )}
                    >
                        {Object.keys(subTopicsData?.sub_topics?.all_courses || {}).map((key) => (
                            <MenuItem key={key} value={key} disabled={Object.keys(selectedValues.all_courses).length >= 2 && !selectedValues.all_courses[key]}>
                                <Checkbox checked={Object.keys(selectedValues.all_courses).includes(key)} />
                                <ListItemText primary={key} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Typography variant="caption" sx={{ mt: 2, display: 'block', color: 'text.secondary' }}>
                    * You must select one or two areas.
                </Typography>
            </DialogContent>

            {isSelectionValid && (
                <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button
                        variant="contained"
                        onClick={handleConfirm}
                        color="primary"
                        sx={{ px: 3, fontWeight: 'bold', borderRadius: 2 }}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
};



export const SubTopicsDialog = ({ open, onClose, subTopicsData, setSelectedSubTopicValues }) => {
    const [selectedValues, setSelectedValues] = useState({});

    const handleConfirm = () => {
        setSelectedSubTopicValues(selectedValues);
        onClose(true); // Pass true to indicate confirmation
    };


    const handleChange = (subTopic, value) => {
        setSelectedValues((prevState) => ({
            ...prevState,
            [subTopic]: [value],
        }));
    };

    const allSelected = Object.keys(subTopicsData?.sub_topics || {}).every(
        (key) => selectedValues[key]
    );

    return (
        <Dialog
            open={open}
            onClose={() => onClose(false)} // Ensure onClose is correctly triggered
            maxWidth="sm"
            fullWidth
            sx={{ textAlign: 'center', p: 3 }}
        >
            <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', pb: 2 }}>
                Select Your Area of Expertise
            </DialogTitle>

            <DialogContent sx={{ textAlign: 'center', pb: 3 }}>
                <Typography variant="body2" sx={{ mb: 3 }}>
                    Choose your area of expertise to ensure the interview is tailored to your
                    strengths.
                </Typography>

                <Stack spacing={3}>
                    {Object.keys(subTopicsData?.sub_topics || {}).map((key) => (
                        <FormControl fullWidth key={key}>
                            <InputLabel id={`sub-topic-value-label-${key}`}>{key}</InputLabel>
                            <Select
                                labelId={`sub-topic-value-label-${key}`}
                                value={selectedValues[key] || ''}
                                onChange={(e) => handleChange(key, e.target.value)}
                                label={key}
                            >
                                {subTopicsData.sub_topics[key].map((value) => (
                                    <MenuItem key={value} value={value}>
                                        {value}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ))}
                </Stack>
            </DialogContent>

            {allSelected && (
                <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button
                        variant="contained"
                        onClick={handleConfirm} // Ensure confirm triggers onClose
                        color="primary"
                        sx={{ px: 3, fontWeight: 'bold' }}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
};
// wipro new requirement subtopics dialog -- end



export const InfoDialog = ({ timer, cameraDisabled, open, onClose, dialog, variant, dialog2, icon, title, count, malpracticeWarning }) => {

    return (
        <Dialog
            open={open}
            cameraDisabled={cameraDisabled}
            textAlign="center"
            onClose={() => onClose(false)}
            sx={{ textAlign: 'center' }}
            scroll="body"
            maxWidth="md"
        // component={m.div}
        // {...varZoom({ distance: 80 }).in}
        >
            <DialogTitle textAlign={'center'} variant='h5' sx={{ pt: 1.5, pb: 0.8 }}>{title}</DialogTitle>


            <React.Fragment>
                <DialogContent sx={{ textAlign: 'center', mt: -1.5 }}>
                    <Stack direction="row" justifyContent="center" alignItems="center">
                        <Box sx={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Box sx={{ position: 'relative', width: '240px', height: '220px' }}>
                                <Paper sx={{
                                    position: 'absolute', left: '42%', backgroundColor: 'background.timer',
                                    height: '25px', width: '40px', textAlign: 'center', borderRadius: '7px'
                                }} elevation={1}><Typography variant='caption' sx={{ p: 0.5 }}>{timer}</Typography></Paper>
                                <video src={bot_berry} muted loop autoPlay style={{ width: '90%', height: '90%' }} />
                                <video src={bot_listening} loop style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%' }} />
                                <Typography variant="body1" color="text.secondary" align="center" style={{ marginTop: '-35px', fontSize: '0.8rem' }}>
                                    'Listening In...'
                                </Typography>
                            </Box>
                        </Box>
                        <Typography variant="body2" sx={{ textAlign: 'left', ml: -1.5, mt: { xs: 0, md: -3, lg: -3, sm: -2 } }}>{dialog}</Typography>
                    </Stack>
                    {malpracticeWarning && (
                        <>
                            <Divider sx={{ mb: 1.5, mt: { xs: 0, md: -2, lg: -2, sm: -1 } }} />
                            <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
                                Important Instructions to Avoid Malpractice During the Interview
                            </Typography>
                            <Stack sx={{ justifyContent: 'center', alignItems: 'center' }}>
                                <List dense textAlign='center'>
                                    <ListItem sx={{ py: 0.3 }}>
                                        <ListItemIcon>
                                            <Icon icon="mdi:cellphone-off" width="11" style={{ color: '#ff5252' }} />
                                        </ListItemIcon>
                                        <ListItemText secondary="Do not use a mobile phone to search for answers or assistance." />
                                    </ListItem>
                                    <ListItem sx={{ py: 0.3 }}>
                                        <ListItemIcon>
                                            <Icon icon="mdi:account-group" width="11" style={{ color: '#ff5252' }} />
                                        </ListItemIcon>
                                        <ListItemText secondary="Do not seek help from others; complete the interview independently." />
                                    </ListItem>
                                    <ListItem sx={{ py: 0.3 }}>
                                        <ListItemIcon>
                                            <Icon icon="mdi:tab-remove" width="11" style={{ color: '#ff5252' }} />
                                        </ListItemIcon>
                                        <ListItemText secondary="Do not switch tabs or browse other websites during the interview." />
                                    </ListItem>

                                    {
                                        !cameraDisabled && (
                                            <>
                                                <ListItem sx={{ py: 0.3 }}>
                                                    <ListItemIcon>
                                                        <Icon icon="mdi:microphone-off" width="11" style={{ color: '#ff5252' }} />
                                                    </ListItemIcon>
                                                    <ListItemText secondary="Do not turn off your microphone or camera at any time during the interview." />
                                                </ListItem>

                                                <ListItem sx={{ py: 0.3 }}>
                                                    <ListItemIcon>
                                                        <Icon icon="mdi:lightbulb-off-outline" width="11" style={{ color: '#ff5252' }} />
                                                    </ListItemIcon>
                                                    <ListItemText secondary="Do not sit in a poorly lit area; ensure your face is clearly visible to the camera." />
                                                </ListItem>
                                            </>
                                        )
                                    }


                                </List>

                                <Typography variant="caption" sx={{ textAlign: 'center', fontStyle: 'italic' }}>
                                    Failure to follow these instructions may be considered malpractice.
                                </Typography>
                            </Stack>
                        </>
                    )}
                </DialogContent>
            </React.Fragment>

            <DialogActions sx={{ justifyContent: 'center', alignItems: 'center', py: 2 }}>
                <Button variant='contained' onClick={() => onClose(true)} color="primary" sx={{}}>
                    Agree
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export const EndInterviewDialog = ({ open, onClose, dialog, variant, onConfirm, dialog2, icon, title, count }) => {
    return (
        <Dialog open={open}
            textAlign="center"
            onClose={onClose}
            sx={{
                m: 0,
                p: 0,
                textAlign: 'center',
                overflow: 'hidden',
                '& .MuiDialog-paper': { overflow: 'hidden', maxWidth: 'sm', width: '100%' }
            }}
            maxWidth="sm"
            onContextMenu={(event) => event.preventDefault()}
        // fullWidth
        >
            <Box
                component={m.div}
                {...getVariant(variant)}
                sx={{
                    p: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    // width: '100%',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    flexWrap: 'wrap',
                }}
            >
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', overflow: 'hidden', transform: { sm: 'scale(0.8)', xs: 'scale(0.6)' } }}>
                    <SvgColor src={'/assets/new-icon/warning.svg'} alt="warning" color='error.dark' style={{ width: 100, height: 100 }} />
                </Box>
                <DialogTitle variant='h5' sx={{ mt: -2 }}>Are you sure you want to end the interview?</DialogTitle>
                <Typography variant="body1" sx={{
                    textAlign: 'center', mt: -2
                }}> This action cannot be undone.</Typography>
                <DialogActions sx={{ justifyContent: 'center', width: '100%' }}>
                    <Button onClick={onClose} variant="outlined" size='medium'>
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} variant="contained" size='medium' >
                        End Interview
                    </Button>
                </DialogActions>
            </Box>
        </Dialog >
    );
};

export const CodeSkipDialog = ({ open, onClose, dialog, variant, onConfirm, dialog2, icon, title, count }) => {
    return (
        <Dialog open={open}
            textAlign="center"
            onClose={onClose}
            sx={{
                m: 0,
                p: 0,
                textAlign: 'center',
                overflow: 'hidden',
                '& .MuiDialog-paper': { overflow: 'hidden', maxWidth: 'sm', width: '100%' }
            }}
            maxWidth="sm"
            onContextMenu={(event) => event.preventDefault()}
        // fullWidth
        >
            <Box
                component={m.div}
                {...getVariant(variant)}
                sx={{
                    p: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    // width: '100%',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    flexWrap: 'wrap',
                }}
            >
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', overflow: 'hidden', transform: { sm: 'scale(0.8)', xs: 'scale(0.6)' } }}>
                    <SvgColor src={'/assets/new-icon/warning.svg'} alt="warning" color='warning.dark' style={{ width: 100, height: 100 }} />
                </Box>
                <DialogTitle variant='h5' sx={{ mt: -3 }}>Are you sure you want to skip this question?</DialogTitle>
                <Typography variant="body1" sx={{
                    textAlign: 'center', mt: -1
                }}> This action will move to next question.</Typography>
                <DialogActions sx={{ justifyContent: 'center', width: '100%' }}>
                    <Button onClick={onClose} variant="outlined" size='medium'>
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} variant="contained" size='medium' >
                        Skip
                    </Button>
                </DialogActions>
            </Box>
        </Dialog >
    );
};

export const CodeSubmitDialog = ({ open, onClose, dialog, variant, onConfirm, dialog2, icon, title, count }) => {
    return (
        <Dialog open={open}
            textAlign="center"
            onClose={onClose}
            sx={{
                m: 0,
                p: 0,
                textAlign: 'center',
                overflow: 'hidden',
                '& .MuiDialog-paper': { overflow: 'hidden', maxWidth: 'sm', width: '100%' }
            }}
            maxWidth="sm"
            onContextMenu={(event) => event.preventDefault()}
        // fullWidth
        >
            <Box
                component={m.div}
                {...getVariant(variant)}
                sx={{
                    p: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    // width: '100%',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    flexWrap: 'wrap',
                }}
            >
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', overflow: 'hidden', transform: { sm: 'scale(0.8)', xs: 'scale(0.6)' } }}>
                    <SvgColor src={'/assets/new-icon/warning.svg'} alt="warning" color='warning.dark' style={{ width: 100, height: 100 }} />
                </Box>
                <DialogTitle variant='h5' sx={{ mt: -3 }}>Are you sure you want to Submit this question?</DialogTitle>
                <Typography variant="body1" sx={{
                    textAlign: 'center', mt: -1
                }}> This action will move to next question.</Typography>
                <DialogActions sx={{ justifyContent: 'center', width: '100%' }}>
                    <Button onClick={onClose} variant="outlined" size='medium'>
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} variant="contained" size='medium' >
                        Submit
                    </Button>
                </DialogActions>
            </Box>
        </Dialog >
    );
};
