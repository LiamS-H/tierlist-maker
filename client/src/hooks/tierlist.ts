import { useState, useEffect } from 'react'
import AXIOS from 'axios'
import { ITierlist, IAccess } from '../models/tierlist';
import { useUser } from './auth';
import { useSnackbar } from './snackbar';
import { useNavigate } from 'react-router';

function useTierlist(_id:string | undefined) {
    const user = useUser()
    const [tierlist, setTierlist] = useState<ITierlist | undefined>(undefined);
    const [access, setAccess] = useState<IAccess>("LOADING");
    const {raiseError, raiseSuccess} = useSnackbar()
    const navigate = useNavigate()

    useEffect(() => {
        if (_id == undefined) { return }
        AXIOS.get(`${import.meta.env.VITE_SERVER_ENDPOINT}/api/tierlist/${_id}`,{
            params: {
                token: user?.user_uuid
            }
        })
        .then((response) => {
            if (response.status == 400) {
                setAccess("DENIED")
                return
            }
            setTierlist(response.data.tierlist)
            setAccess(response.data.access)
        })
        .catch((error)=>{
            setAccess("DENIED")
            console.error(error)
        })
    }, [_id, user]);

    async function updateTierlist(tierlist:ITierlist): Promise<"SUCCESS" | "ERROR" | undefined> {
        if (user == null ) {
            raiseError("please sign in to continue")
            console.error("please sign in to continue")
            return "ERROR";
        }

        if (access == "DENIED") {
            
            console.error("You should not have access to this tierlist")
            return "ERROR";
        }
        if (access == "VIEW") {
            console.error("Error Tierlist is View Only")
            return "ERROR";
        }
        setTierlist(tierlist)
        await AXIOS.put(`${import.meta.env.VITE_SERVER_ENDPOINT}/api/tierlist/${_id}`,{
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
            }
            return "SUCCESS"
        })
        .catch((e: Error)=>{
            console.error(e)
            return "ERROR"
        })
    }
    async function shareTierlist(username:string, can_edit:boolean): Promise<"SUCCESS" | "ERROR" | undefined>  {
        if (user == null ) {
            console.error("Must be signed in to delete tierlist")
            return "ERROR";
        }
        if (access == "DENIED") {
            console.error("You should not have access to this tierlist")
            return "ERROR";
        }
        if (access != "OWNER") {
            console.error("You do not have permission to share this tierlist")
            return "ERROR";
        }
        await AXIOS.put(`${import.meta.env.VITE_SERVER_ENDPOINT}/api/share/${_id}`,{
            username:username,
            can_edit:can_edit?1:0
        }, {
            params: {
                token: user.user_uuid,
            },
        })
        .then(() => {
            raiseSuccess("tierlist shared successfuly.")
            return "SUCCESS"
        })
        .catch((e: Error)=>{
            raiseError("something went wrong.")
            console.error(e)
            return "ERROR"
        })
    }

    async function deleteTierlist(): Promise<"SUCCESS" | "ERROR" | undefined> {
        if (user == null ) {
            console.error("Must be signed in to delete tierlist")
            return"ERROR";
        }
        if (access == "DENIED") {
            console.error("You should not have access to this tierlist")
            return "ERROR";
        }
        if (access != "OWNER") {
            console.error("You do not have permission to delete this tierlist")
            return "ERROR";
        }
        await AXIOS.delete(`${import.meta.env.VITE_SERVER_ENDPOINT}/api/tierlist/${_id}`,{
            params: {
                token: user.user_uuid,
            },
        })
        .then((response) => {
            if (response.status != 200) {
                raiseError("something went wrong.")
                return "ERROR"
            }
            raiseSuccess("tierlist successfuly deleted.")
            setTierlist(undefined)
            setAccess("DENIED")
            return "SUCCESS"
        })
        .catch((e: Error)=>{
            console.error(e)
            return "ERROR"
        })
        return "ERROR"
    }

    async function copyTierlist(): Promise<"SUCCESS" | "ERROR" | undefined>  {
        if (user == null ) {
            console.error("Must be signed in to copy tierlist")
            return"ERROR";
        }
        if (access == "DENIED") {
            console.error("You should not have access to this tierlist")
            return "ERROR";
        }
        if (tierlist == undefined) {
            console.error("Could not find tierlist to copy")
            return "ERROR"
        }
        const copyTierlist = {
            ...tierlist,
            name: `${tierlist.name} (copy)`
        }
        await AXIOS.post(`${import.meta.env.VITE_SERVER_ENDPOINT}/api/tierlist`,{
            tierlist: copyTierlist
        }, {
            params: {
                token: user.user_uuid,
            },
        })
        .then((response) => {
            const tierlist: ITierlist = response.data
            if (tierlist == undefined) return "ERROR"
            raiseSuccess("tierlist copied successfuly.")
            navigate(`/tierlist/${tierlist._id}`)
            return "SUCCESS"
        })
        .catch((e: Error)=>{
            raiseError("something went wrong.")
            console.error(e)
            return "ERROR"
        })
    }

    return { tierlist, updateTierlist, shareTierlist, deleteTierlist, copyTierlist, access };
}

export { useTierlist }