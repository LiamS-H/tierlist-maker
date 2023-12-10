import TierlistCardList from "../../components/TierlistCardList"
import { useSearchPublicTierlists } from "../../hooks/tierlists"
import { TextField } from "@mui/material"

export default function Public() {
    const {tierlists, query, setQuery } = useSearchPublicTierlists()
    
    
    return (<>
        <h1>Public Tierlists</h1>
        <TextField
            label="search"
            value={query}
            variant="outlined"
            onChange={(e)=>{
                setQuery(e.target.value)
            }}
        />
        <TierlistCardList tierlists={tierlists} />
    </>)
}