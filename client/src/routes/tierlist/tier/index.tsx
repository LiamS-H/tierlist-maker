import { IItem, ITier } from "../../../models/tierlist"
import Item from "./item"

import { Typography, Container } from "@mui/material"

import { Droppable } from '@hello-pangea/dnd'


export default function Tier(props: {tier: ITier, items: IItem[], isDragDisabled?:boolean}) {
    const getBackgroundColor = (tierId:number) => {
        switch (tierId) {
          case 0:
            return 'green';
          case 1:
            return 'yellow';
          case 2:
            return 'red';
          default:
            return 'transparent';
        }
      };
    return (
    <Container
        sx={{
            borderRadius: '8px',
            backgroundColor: getBackgroundColor(props.tier._id),
        }}
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
                    display: "flex",
                    flexDirection: "row",
                    minHeight: "150px",
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