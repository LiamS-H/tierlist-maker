import { useState } from 'react';
import Button from '@mui/material/Button';
import FileCopyIcon from '@mui/icons-material/FileCopy';

interface CopyButtonProps {
    copyTierlist: () => Promise<'SUCCESS' | 'ERROR' | undefined>;
}

function CopyButton({ copyTierlist }: CopyButtonProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleCopy = async () => {
        try {
            setIsLoading(true);
            const result = await copyTierlist();
            if (result == undefined) {return;}
        } catch (error) {
            console.error('Error copying tierlist:', error);
        } finally {
            setIsLoading(false);
        }
    };

  return (
        <div>
        <Button
            variant="contained"
            color="primary"
            startIcon={<FileCopyIcon />}
            onClick={handleCopy}
            disabled={isLoading}
        >
            Copy Tierlist
        </Button>
        </div>
    );
}

export default CopyButton;