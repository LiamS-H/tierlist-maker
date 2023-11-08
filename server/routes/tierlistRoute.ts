import express from "express";
import { Tierlist, getTierlistByID, checkAccess, updateTierList } from "../models/tierlist";

const router = express.Router();

router.get('/', async (req, res) => {
    res.status(400).json({ message: 'Specify a collection with api/tierlist/:uid or use api/tierlists to get all' })
})

router.get('/:uid', async (req, res) => {
    const id = req.params.uid
    const { token } = req.query
    if (typeof token !== "string") {
        return res.status(400).json({ message: 'Invalid Token Type' })
    }
    if (await checkAccess(id, token) == "DENIED") {
        return res.status(400).json({ message: 'Access Denied' })
    }
    const tierlist = await getTierlistByID(id, token)
    if (tierlist == null) {
        return res.status(500).json({ message: 'Tierlist Not Found' })
    }
    res.status(200).json(tierlist)
})

router.put('/:uid', async (req, res) => {
    const id = req.params.uid
    const { token } = req.query
    const { tierlist } = req.body
    if (typeof token !== "string") {
        return res.status(400).json({ message: 'Invalid Token Type' })
    }
    if (await checkAccess(id, token) != "EDIT") {
        return res.status(400).json({ message: 'Access Denied' })
    }
    await updateTierList(tierlist, token)
    res.status(202).json(tierlist)
})

export default router;