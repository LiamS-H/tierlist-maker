import { useState, useEffect } from 'react'
import AXIOS from 'axios'
import dotenv from 'dotenv';
import { Tierlist } from '../models/tierlist';
dotenv.config();

export function usePublicTierlists() {
    const [data, setData] = useState<Tierlist[]>([]);
  
    useEffect(() => {
        AXIOS.get(`${process.env.PORT}/api/tierlists`)
        .then((response) => JSON.parse(response.data))
        .then((json) => setData(json));
    }, []);
  
    return data;
}