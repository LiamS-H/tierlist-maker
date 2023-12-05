import { useState } from 'react'
import { Navigate, useParams } from "react-router"
import { useTierlist } from "../../hooks/tierlist"
import LoadingTierlist from "./loading"
import { Button, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';


import { DragDropContext, DropResult } from "@hello-pangea/dnd"

import Tier from "./tier"
import { ITierlist } from "../../models/tierlist"

export default function Tierlist() {
    const { id } = useParams()
    const { tierlist, access, updateTierlist, deleteTierlist, shareTierlist } = useTierlist(id)
    const [ dragging, setDragging ] = useState<boolean>(false)

    if (tierlist == undefined && access == "DENIED") {
        return (<Navigate to={"/"}/>)
    }

    if (tierlist == undefined) {
        return (<LoadingTierlist />)
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

    
    return (<>
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
        
        <Button
            variant="contained"
            color="error" // You can use 'secondary' for red in MUI v5
            startIcon={<DeleteIcon />}
            onClick={deleteTierlist}
        >
            Delete
        </Button>
        <Typography>{dragging?"dragging":"notdragging"}</Typography>
    </>)
}