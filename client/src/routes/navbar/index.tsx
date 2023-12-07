import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useLogout, useUser } from '../../hooks/auth';

export default function NavBar() {
    const navigate = useNavigate()
    const user = useUser();
    const logout = useLogout()

    return (
        <AppBar position="static">
        <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Navbar
            </Typography>
            <Button color="inherit" component={Link} to="/">
                Home
            </Button>
            <Button color="inherit" onClick={()=>{navigate('/public')}}>
                Public
            </Button>
            {user ? (
            <Button color="inherit" onClick={()=>{navigate('/shared')}}>
                Shared
            </Button>
            ) : <></>}
            {user ? (
            <Button color="inherit" onClick={()=>{logout();navigate('/')}}>
                Logout
            </Button>
            ) : (
            <Button color="inherit" component={Link} to="/login">
                Login
            </Button>
            )}
        </Toolbar>
        </AppBar>
    );
}