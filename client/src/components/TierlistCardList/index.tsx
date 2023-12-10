import { Typography } from "@mui/material";
import { ITierlist } from "../../models/tierlist";
import TierlistCard from "../TierlistCard";

export default function TierlistCardList(props: {tierlists: ITierlist[]}) {
    if (props.tierlists.length == 0) return <Typography>0 tierlists</Typography>;
    return (<>
        {
            props.tierlists.map((tierlist)=>(
                <TierlistCard key={tierlist._id} tierlist={tierlist}/>
            ))
        }
    </>)
    
}