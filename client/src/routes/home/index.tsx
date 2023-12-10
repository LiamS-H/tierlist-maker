import TierlistCardList from "../../components/TierlistCardList"
import { useUser } from "../../hooks/auth"
import { usePublicTierlists, useUserTierlists } from "../../hooks/tierlists"

export default function Home() {
    const tierlists = usePublicTierlists()
    const userTierlists = useUserTierlists()
    const user = useUser()
    
    return (<>
        {user?<h1>{user.username}'s Tierlists</h1>:<h1>Home</h1>}
        <TierlistCardList tierlists={user?userTierlists:tierlists} />
    </>)
}