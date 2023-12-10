import { useState } from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

interface DeleteButtonProps {
  deleteTierlist: () => Promise<'SUCCESS' | 'ERROR' | undefined>;
}

function DeleteButton ({ deleteTierlist }: DeleteButtonProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            const result = await deleteTierlist();
            if (result == undefined) {return;}
        } catch (error) {
            console.error('Error deleting tierlist:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Button
                variant="contained"
                color="error" // or 'secondary' depending on your MUI version
                startIcon={<DeleteIcon />} // Assuming you have a DeleteIcon component
                onClick={handleDelete}
                disabled={isLoading}
            >
                Delete Tierlist
            </Button>
        </div>
    )
}

export default DeleteButton;