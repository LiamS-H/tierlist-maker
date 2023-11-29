import { Tierlist } from "../../models/tierlist";
import TierlistCard from "../TierlistCard";

export default function TierlistCardList(props: {tierlists: Tierlist[]}) {
    return (<>
        {
            props.tierlists.map((tierlist)=>(
                <TierlistCard key={tierlist._id} tierlist={tierlist}/>
            ))
        }
    </>)
    
}