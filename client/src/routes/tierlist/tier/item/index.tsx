import { IItem } from "../../../../models/tierlist"

import { Card, CardContent, CardMedia, Typography } from "@mui/material"

import { Draggable } from '@hello-pangea/dnd'


export default function Item(props: {item: IItem, index: number, isDragDisabled?:boolean}) {
    return (
        <Draggable
            draggableId={props.item._id.toString()}
            index={props.index}
            isDragDisabled={props.isDragDisabled}
        >
            {(provided)=>(
                <Card
                    sx={{
                        width: 140, height: 140,
                        cursor: props.isDragDisabled?"auto":"grab"
                    }}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    <CardMedia
                        image={props.item.item_img}
                        title={props.item.item_name}
                    />
                    <CardContent
                        sx={{height: 10, }}
                    >
                        <Typography>
                            {props.item.item_name}
                        </Typography>
                    </CardContent>
                    
                </Card>
            )}
        </Draggable>
    )
}