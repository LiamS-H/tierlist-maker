import TierlistCardList from "../../components/TierlistCardList"
import { usePublicTierlists } from "../../hooks/tierlists"

export default function Home() {
    const { tierlists } = usePublicTierlists()
    return (<>
        <h1>Home</h1>
        <TierlistCardList tierlists={tierlists} />
    </>)
}