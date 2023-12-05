import { useState, useEffect } from 'react'
import AXIOS from 'axios'
import { ITierlist, Access } from '../models/tierlist';
import { useUser } from './auth';

function useTierlist(_id:string | undefined) {
    const user = useUser()
    const [tierlist, setTierlist] = useState<ITierlist | undefined>(undefined);
    const [access, setAccess] = useState<Access>("DENIED");

    useEffect(() => {
        if (_id == undefined) { return }
        AXIOS.get(`${import.meta.env.VITE_SERVER_ENDPOINT}/api/tierlist/${_id}`,{
            params: {
                token: user?.user_uuid
            }
        })
        .then((response) => {
            setTierlist(response.data.tierlist)
            setAccess(response.data.access)
        })
    }, [_id, user?.user_uuid]);

    async function updateTierlist(tierlist:ITierlist) {
        if (user == null ) {
            console.error("You should not have access to this tierlist")
            return;
        }

        if (access == "DENIED") {
            console.error("You should not have access to this tierlist")
            return;
        }
        if (access == "VIEW") {
            console.error("Error Tierlist is View Only")
            return;
        }
        setTierlist(tierlist)
        AXIOS.put(`${import.meta.env.VITE_SERVER_ENDPOINT}/api/tierlist/${_id}`,{
            tierlist: tierlist,
        }, {
            params: {
                token: user.user_uuid,
            },
        })
        .then((response) => {
            if (response.data == undefined) {
                return "ERROR"
            }
            if (tierlist != response.data) {
                setTierlist(response.data)
                return "ERROR"
            }
            return "SUCCESS"
        })
        .catch((e: Error)=>{
            console.error(e)
            return "ERROR"
        })
    }

    return { tierlist, updateTierlist, access };
}

export { useTierlist }