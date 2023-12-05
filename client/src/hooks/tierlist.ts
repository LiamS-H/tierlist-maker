import { useState, useEffect } from 'react'
import AXIOS from 'axios'
import { ITierlist, IAccess } from '../models/tierlist';
import { useUser } from './auth';
import { useSnackbar } from './snackbar';

function useTierlist(_id:string | undefined) {
    const user = useUser()
    const [tierlist, setTierlist] = useState<ITierlist | undefined>(undefined);
    const [access, setAccess] = useState<IAccess>("LOADING");
    const {raiseError, raiseSuccess} = useSnackbar()


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
    }, [_id, user?.user_uuid]);

    async function updateTierlist(tierlist:ITierlist) {
        if (user == null ) {
            raiseError("please sign in to continue")
            console.error("please sign in to continue")
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
            }
            return "SUCCESS"
        })
        .catch((e: Error)=>{
            console.error(e)
            return "ERROR"
        })
    }
    async function shareTierlist(username:string, can_edit:boolean) {
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
        AXIOS.put(`${import.meta.env.VITE_SERVER_ENDPOINT}/api/sharing/${_id}`,{
            username:username,
            can_edit:can_edit
        }, {
            params: {
                token: user.user_uuid,
            },
        })
        .then(() => {
            raiseSuccess("tierlist shared deleted.")
            return "SUCCESS"
        })
        .catch((e: Error)=>{
            raiseError("something went wrong.")
            console.error(e)
            return "ERROR"
        })
    }

    async function deleteTierlist() {
        console.log(access)
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
        AXIOS.delete(`${import.meta.env.VITE_SERVER_ENDPOINT}/api/tierlist/${_id}`,{
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
    }

    return { tierlist, updateTierlist, shareTierlist, deleteTierlist, access };
}

export { useTierlist }