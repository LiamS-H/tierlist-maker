import { IItem, ITier } from "../../../models/tierlist"
import Item from "./item"

import { Typography, Container } from "@mui/material"

import { Droppable } from '@hello-pangea/dnd'


export default function Tier(props: {tier: ITier, items: IItem[], isDragDisabled?:boolean}) {
    return (
    <Container
        
    >
        <Typography>
            {props.tier.name}
        </Typography>
        <Droppable
            droppableId={props.tier._id.toString()}
            direction="horizontal"
        >
            {(provided) => (
                <Container
                sx={{
                    backgroundColor:"", 
                    adding: '20px',
                    display: "flex",
                    flexDirection: "row",
                    minHeight: "200px",
                }}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    {props.items.map((item, index)=>
                        <Item key={item._id} item={item} index={index} isDragDisabled={props.isDragDisabled}/>
                    )}
                    {provided.placeholder}
                </Container>
            )}
        </Droppable>
    </Container>
    )
}