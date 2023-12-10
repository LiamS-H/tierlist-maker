import { Snackbar } from '@mui/material';
import { Alert } from '@mui/material';
import { useSnackbar } from '../../hooks/snackbar';


export default function SnackbarFromContext() {
    const { snackbar, closeSnackbar } = useSnackbar()
    return (
    <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
    >
        <Alert severity={snackbar.severity} onClose={closeSnackbar}>
            {snackbar.message}
        </Alert>
    </Snackbar>
    )
}