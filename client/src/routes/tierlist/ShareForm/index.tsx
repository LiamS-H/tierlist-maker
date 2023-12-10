import { useState } from 'react';
import { TextField, Button, ToggleButton, ToggleButtonGroup, Box } from '@mui/material';
import { Visibility as VisibilityIcon, Edit as EditIcon } from '@mui/icons-material';


interface ShareFormProps {
  shareTierlist: (username: string, canEdit: boolean) => Promise<"ERROR" | "SUCCESS" | undefined>;
}

function ShareForm({ shareTierlist }: ShareFormProps): JSX.Element {
    const [username, setUsername] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [canEdit, setCanEdit] = useState<boolean>(false);

    const handleShare = async () => {
        try {
            setIsLoading(true);
            const result = await shareTierlist(username, canEdit);
            if (result == undefined) {return;}
        } catch (error) {
            console.error('Error sharing tierlist:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
    <Box sx={{display:'flex',flexFlow:'row'}}>
    <TextField
        label="Username"
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
    />
    <ToggleButtonGroup
        value={canEdit}
        exclusive
        onChange={() => setCanEdit((prevCanEdit) => !prevCanEdit)}
        aria-label="Can Edit"
    >
        <ToggleButton value={true} aria-label="Edit">
        <EditIcon />
        </ToggleButton>
        <ToggleButton value={false} aria-label="View">
        <VisibilityIcon />
        </ToggleButton>
    </ToggleButtonGroup>
    <Button
        variant="contained"
        color="primary"
        onClick={handleShare}
        disabled={isLoading || !username}
    >
        Share
    </Button>
    </Box>
    )
}

export default ShareForm;