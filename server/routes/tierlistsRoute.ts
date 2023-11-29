import express from "express";
import { Tierlist, getPublicTierlists, searchPublicTierlists } from "../models/tierlist";

const router = express.Router();

router.get('/', async (req, res) => {
    const tierlists = await getPublicTierlists()

    res.status(200).json(tierlists)
})

router.get('/public', async (req, res) => {
    const tierlists = await getPublicTierlists()

    res.status(200).json(tierlists)
})

router.get('/search', async (req, res) => {
    const { search } = req.query
    if (typeof search !== "string") {
        return res.status(400).json({ message: 'Invalid Search Type' })
    }

    const tierlists = await searchPublicTierlists(search)

    res.status(200).json(tierlists)
})

router.get('/shared', async (req, res) => {
    const { token } = req.query

    if (typeof token !== "string") {
        return res.status(400).json({ message: 'Invalid Token Type' })
    }

    res.status(200).json()
})

export default router