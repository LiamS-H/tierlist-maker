import { useState } from 'react'
import { Navigate, useParams } from "react-router"
import { useTierlist } from "../../hooks/tierlist"
import LoadingTierlist from "./loading"
import { Box, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

import DeleteButton from './DeleteButton';
import ShareForm from './ShareForm';
import CopyButton from './CopyButton';

import { DragDropContext, DropResult } from "@hello-pangea/dnd"

import Tier from "./tier"
import { ITierlist } from "../../models/tierlist"

import LockIcon from '@mui/icons-material/Lock'
import PublicIcon from '@mui/icons-material/Public'



export default function Tierlist() {
    const { id } = useParams()
    const { tierlist, access, updateTierlist, deleteTierlist, shareTierlist, copyTierlist } = useTierlist(id)
    const [ dragging, setDragging ] = useState<boolean>(false)

    if (tierlist == undefined && access == "DENIED") {
        return (<Navigate to={"/"}/>)
    }

    if (tierlist == undefined) {
        return (<LoadingTierlist />)
    }

    function updateName(name:string) {
        if (name=="") return;
        if (tierlist==undefined) return;
        updateTierlist({...tierlist, name: name})
    }

    function onDragStart() {
        setDragging(true);
    }

    function onDragEnd(result: DropResult) {
        setDragging(false)
        if (tierlist == undefined) return;

        const {destination, source, draggableId} = result

        if (!destination) {return;}

        if (destination.droppableId === source.droppableId && destination.index == source.index) {return;}

        const start_tier = tierlist.tiers[Number(source.droppableId)]
        const end_tier = tierlist.tiers[Number(destination.droppableId)]

        if (start_tier == end_tier) {
            const tier = start_tier
            const new_items = [...tier.items]
            new_items.splice(source.index, 1)
            new_items.splice(destination.index, 0, Number(draggableId))

            const new_tier = {
                ...tier,
                items: new_items
            }

            const new_tierlist: ITierlist = {
                ...tierlist,
                tiers: {
                    ...tierlist.tiers,
                    [new_tier._id]: new_tier
                }
            }

            updateTierlist(new_tierlist)
        }
        if (start_tier != end_tier) {
            const new_start_items = [...start_tier.items]
            new_start_items.splice(source.index, 1)
            const new_start_tier = {
                ...start_tier,
                items: new_start_items
            }

            const new_end_items = [...end_tier.items]
            new_end_items.splice(destination.index, 0, Number(draggableId))
            const new_end_tier = {
                ...end_tier,
                items: new_end_items
            }
            

            const new_tierlist: ITierlist = {
                ...tierlist,
                tiers: {
                    ...tierlist.tiers,
                    [new_start_tier._id]: new_start_tier,
                    [new_end_tier._id]: new_end_tier
                }
            }

            updateTierlist(new_tierlist)
        }

        
    }
    const can_edit = access=="EDIT" || access=="OWNER"

    
    return (<>
        {can_edit?
        <TextField
            value={tierlist.name}
            variant="outlined"
            onChange={(e)=>{
                updateName(e.target.value)
            }}
        />:<Typography>{tierlist.name}</Typography>
        }
        <Box sx={{display:'flex'}}>
            <Typography>Owner:{tierlist.owner}</Typography>
            {access == "OWNER" ? <DeleteButton deleteTierlist={deleteTierlist} />:<></>}
            <CopyButton copyTierlist={copyTierlist}/>
        </Box>
        <DragDropContext
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
        >
            {Object.keys(tierlist.tiers).map((tier_id) => {
                const tier = tierlist.tiers[Number(tier_id)]
                const items = tier.items.map((item_id) => tierlist.items[item_id])

                return <Tier key={tier._id} tier={tier} items={items} isDragDisabled={access=="VIEW"||dragging}/>
            })}
        </DragDropContext>

        {access == "OWNER" ?
        <Box sx={{display:"flex", flexFlow:"column"}}>
        <Typography>Sharing</Typography>
        <ShareForm shareTierlist={shareTierlist} />
        <Typography>Visibility</Typography>
        <ToggleButtonGroup
            value={tierlist.visibility}
            exclusive
            onChange={() => updateTierlist(
                {
                    ...tierlist,
                    visibility:tierlist.visibility=="Public"?"Private":"Public"
                }
            )}
            aria-label="Can Edit"
        >
            <ToggleButton value={"Public"} aria-label="Edit">
            <PublicIcon />
            </ToggleButton>
            <ToggleButton value={"Private"} aria-label="View">
            <LockIcon />
            </ToggleButton>
        </ToggleButtonGroup>        
        </Box>
        :<></>
        }
    </>)
}