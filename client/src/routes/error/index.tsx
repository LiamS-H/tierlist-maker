import { Container, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Error() {
  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h1">
        404
      </Typography>
      <Typography variant="h6">
        The page you’re looking for doesn’t exist.
      </Typography>
      <Link to='/'>
        <Button variant="outlined" color={'error'}>Back Home</Button>
      </Link>
    </Container>
  );
}