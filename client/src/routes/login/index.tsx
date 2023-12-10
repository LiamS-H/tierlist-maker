import { useState, FormEvent } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { useLogin } from '../../hooks/auth';
import { useNavigate } from "react-router-dom";
import { useSnackbar } from '../../hooks/snackbar';

export default function Login() {
    const navigate = useNavigate();
    const login = useLogin()
    const {raiseError, raiseSuccess} = useSnackbar()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
        const response = await login(email, password)
        if (response === 'SUCCESS') {
            raiseSuccess('Login successful!');
            navigate(-1)
        } else {
            raiseError('Login denied. Please check your credentials.');
        }
        } catch (e) {
            raiseError('something went wrong');
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
        </Container>
  );
}