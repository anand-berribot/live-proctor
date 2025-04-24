import React, { forwardRef } from 'react';
import List from '@mui/material/List';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { Stack, Box, Card } from '@mui/material';

import Iconify from 'src/components/iconify';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function FullScreenDialog({ dialog, primaryText1, secondaryText1, primaryText2, secondaryText2 }) {
  return (
    <Dialog
      fullScreen
      open={dialog.value}
      onClose={dialog.onFalse}
      TransitionComponent={Transition}
    >

{/* <AppBar position="relative" color="default">
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={dialog.onFalse}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1 }}>
            Your Header Text Here
          </Typography>
        </Toolbar>
      </AppBar> */}


      <Stack>
        <Stack component={Card} spacing={3} sx={{ pt: '3vh', pb: '3vh', pl: '3vw', pr: '3vw', m: 2, ml: 4, mr: 4, bgcolor: 'background.bg' }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}>
            <Card sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 3, width: '80vw', minHeight: '50vh'
            }}>
              <Stack direction="column" spacing={2} sx={{ justifyContent: 'center', alignItems: 'center' }}>
                <div className='end-text'>
                  {primaryText1}
                </div>
                <div className='end-text end-text-1'>
                  {secondaryText1}
                </div>
              </Stack>
            </Card>
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}




















// import { forwardRef } from 'react';

// import List from '@mui/material/List';
// import Slide from '@mui/material/Slide';
// import Button from '@mui/material/Button';
// import AppBar from '@mui/material/AppBar';
// import Dialog from '@mui/material/Dialog';
// import Divider from '@mui/material/Divider';
// import Toolbar from '@mui/material/Toolbar';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import ListItemText from '@mui/material/ListItemText';
// import ListItemButton from '@mui/material/ListItemButton';

// import { useBoolean } from 'src/hooks/use-boolean';

// import Iconify from 'src/components/iconify';

// // ----------------------------------------------------------------------

// const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

// export default function FullScreenDialog() {
//   const dialog = useBoolean();

//   return (
//     <>
//       <Button variant="outlined" color="error" onClick={dialog.onTrue}>
//         Full Screen Dialogs
//       </Button>

//       <Dialog
//         fullScreen
//         open={dialog.value}
//         onClose={dialog.onFalse}
//         TransitionComponent={Transition}
//       >
//         <AppBar position="relative" color="default">
//           <Toolbar>
//             <IconButton color="inherit" edge="start" onClick={dialog.onFalse}>
//               <Iconify icon="mingcute:close-line" />
//             </IconButton>

//             <Typography variant="h6" sx={{ flex: 1, ml: 2 }}>
//               Sound
//             </Typography>

//             <Button autoFocus color="inherit" variant="contained" onClick={dialog.onFalse}>
//               Save
//             </Button>
//           </Toolbar>
//         </AppBar>

//         <List>
//           <ListItemButton>
//             <ListItemText primary="Phone ringtone" secondary="Titania" />
//           </ListItemButton>

//           <Divider />

//           <ListItemButton>
//             <ListItemText primary="Default notification ringtone" secondary="Tethys" />
//           </ListItemButton>
//         </List>
//       </Dialog>
//     </>
//   );
// }
