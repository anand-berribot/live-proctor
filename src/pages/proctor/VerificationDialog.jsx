import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
} from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'src/routes/hooks';

export default function VerificationStepDialog({ open, onClose }) {
    const router = useRouter();
    const [loadingProceed, setLoadingProceed] = useState(false);

    const handleProceed = async () => {
        setLoadingProceed(true);

        try {
            await new Promise((res) => setTimeout(res, 1500)); 
            // setVerificationDone(true);
            onClose();
            router.push('/verification-success');
        } catch (error) {
            console.error("API call failed:", error);
        } finally {
            setLoadingProceed(false);
        }
    };
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            {/* <DialogTitle sx={{ fontWeight: 600, color: 'primary.main' }}>
                Thank You
            </DialogTitle> */}

            <DialogContent>
                <Typography variant="subtitle1"  sx={{ my: 4 }}>
                    Thank you for submitting your sample video and audio. Everything looks good.
                </Typography>
                <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    Click Proceed to complete the verification process.
                </Typography>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={loadingProceed}
                    onClick={handleProceed}
                    sx={{ fontWeight: 500, borderRadius: 1 }}
                >
                    Proceed
                </Button>
            </DialogActions>
        </Dialog>
    );
}
