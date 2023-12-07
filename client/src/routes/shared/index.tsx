import TierlistCardList from "../../components/TierlistCardList"
import { useSharedTierlists } from "../../hooks/tierlists"

export default function Shared() {
    const tierlists = useSharedTierlists()
    return (<>
        <h1>Shared With Me</h1>
        <TierlistCardList tierlists={tierlists} />
    </>)
}