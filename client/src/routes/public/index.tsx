import TierlistCardList from "../../components/TierlistCardList"
import { usePublicTierlists } from "../../hooks/tierlists"

export default function Public() {
    const tierlists = usePublicTierlists()
    
    return (<>
        <h1>Public Tierlists</h1>
        <TierlistCardList tierlists={tierlists} />
    </>)
}