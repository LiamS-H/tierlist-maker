import { Link } from "react-router-dom";
import { ITierlist } from "../../models/tierlist";
import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock'
import PublicIcon from '@mui/icons-material/Public'

export default function TierlistCard(props: {tierlist: ITierlist}) {
    return (<>
    <Card>
        <CardActionArea LinkComponent={Link} to={`/tierlist/${props.tierlist._id}`}>
            <CardContent>
                <Box sx={{display:"flex",flexFlow:"row"}}>
                    <Typography gutterBottom variant="h5" component="div">
                        {props.tierlist.name}
                    </Typography>
                    {props.tierlist.visibility == "Public"?<PublicIcon/>:<LockIcon/>}
                </Box>
                <Typography variant="body2" color="text.secondary">
                    {props.tierlist.owner}
                </Typography>
            </CardContent>
        </CardActionArea>

    </Card>
    </>)
}