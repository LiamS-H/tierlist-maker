import { useState, useEffect } from 'react'
import AXIOS from 'axios'
import { ITierlist, Access } from '../models/tierlist';

function useTierlist(_id:string | undefined) {
    const [tierlist, setTierlist] = useState<ITierlist | undefined>(undefined);
    const [access, setAccess] = useState<Access>("DENIED");

    useEffect(() => {
        if (_id == undefined) { return }
        AXIOS.get(`${import.meta.env.VITE_SERVER_ENDPOINT}/api/tierlist/${_id}`)
        .then((response) => {
            setTierlist(response.data.tierlist)
            setAccess(response.data.access)
        })
    }, [_id]);

    return { tierlist, setTierlist, access };
}

export { useTierlist }