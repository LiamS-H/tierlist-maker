import { useState, useEffect } from 'react'
import AXIOS from 'axios'
import { ITierlist } from '../models/tierlist';

function usePublicTierlists() {
    const [tierlists, setTierlists] = useState<ITierlist[]>([]);
  
    useEffect(() => {
        AXIOS.get(`${import.meta.env.VITE_SERVER_ENDPOINT}/api/tierlists`)
        .then((response) => setTierlists(response.data))
    }, []);
  
    return { tierlists };
}

export { usePublicTierlists }