import { useState, useEffect } from 'react'
import AXIOS from 'axios'
import { ITierlist } from '../models/tierlist';
import { useUser } from './auth';

function useSharedTierlists() {
    const [tierlists, setTierlists] = useState<ITierlist[]>([]);
    const user = useUser()

    useEffect(() => {
        if (user == null) return;
        AXIOS.get(`${import.meta.env.VITE_SERVER_ENDPOINT}/api/tierlists/shared`,{
            params: {
                token:user.user_uuid
            }
        })
        .then((response) => setTierlists(response.data))
    }, [user]);
  
    return tierlists;
}

function useUserTierlists() {
    const [tierlists, setTierlists] = useState<ITierlist[]>([]);
    const user = useUser()

    useEffect(() => {
        if (user == null) return;
        AXIOS.get(`${import.meta.env.VITE_SERVER_ENDPOINT}/api/tierlists/user`,{
            params: {
                token:user.user_uuid
            }
        })
        .then((response) => setTierlists(response.data))
    }, [user]);
  
    return tierlists;
}

function usePublicTierlists() {
    const [tierlists, setTierlists] = useState<ITierlist[]>([]);
  
    useEffect(() => {
        AXIOS.get(`${import.meta.env.VITE_SERVER_ENDPOINT}/api/tierlists`)
        .then((response) => setTierlists(response.data))
    }, []);
  
    return tierlists;
}

function useSearchPublicTierlists() {
    const [tierlists, setTierlists] = useState<ITierlist[]>([]);
    const [query, setQuery] = useState<string>("");
  
    useEffect(() => {
        AXIOS.get(`${import.meta.env.VITE_SERVER_ENDPOINT}/api/tierlists/search`,{
            params: {
                search:query
            }
        })
        .then((response) => setTierlists(response.data))
    }, [query]);
  
    return { tierlists, query, setQuery  };
}


export { usePublicTierlists, useSearchPublicTierlists, useSharedTierlists, useUserTierlists}