import { useState, FormEvent } from 'react';
import { TextField, Button, Container, Typography, Snackbar } from '@mui/material';
import { Alert } from '@mui/material';
import { useLogin } from '../../hooks/auth';
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const login = useLogin()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'error'|'success'>('success');

    const handleLogin = async () => {
        try {
        const response = await login(email, password)
        if (response === 'SUCCESS') {
            setSnackbarSeverity('success');
            setSnackbarMessage('Login successful!');
        } else {
            setSnackbarSeverity('error');
            setSnackbarMessage('Login denied. Please check your credentials.');
            navigate("/")
        }
        } catch (error) {
            setSnackbarSeverity('error');
            setSnackbarMessage('something went wrong');
        } finally {
        setSnackbarOpen(true);
        }
    };

    const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
            e.preventDefault(); // Prevents the default form submission
            handleLogin();
    };

    return (
        <Container component="main" maxWidth="xs">
        <div>
        <Typography component="h1" variant="h5">
            Login
        </Typography>
        <form onSubmit={handleSubmit}>
        <TextField
            label="Email"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
            label="Password"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
        >
            Login
        </Button>
        </form>
        </div>
        <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
        >
            <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)}>
                {snackbarMessage}
            </Alert>
        </Snackbar>
        </Container>
  );
}