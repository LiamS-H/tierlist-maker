import { Link } from "react-router-dom";
import { Tierlist } from "../../models/tierlist";
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';

export default function TierlistCard(props: {tierlist: Tierlist}) {
    return (<>
    <Card>
        <CardActionArea LinkComponent={Link} to={`/tierlist/${props.tierlist._id}`}>
            <CardContent>
            <Typography gutterBottom variant="h5" component="div">
                {props.tierlist.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {props.tierlist.owner}
            </Typography>
            </CardContent>
        </CardActionArea>

    </Card>
    </>)
}