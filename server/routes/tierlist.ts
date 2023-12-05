import express from "express";
import { Tierlist, exists, getTierlistByID, checkAccess, updateTierlist, createTierlist, deleteTierlist } from "../models/tierlist";

const router = express.Router();

router.get('/', async (req, res) => {
    res.status(400).json({ message: 'Specify a collection with api/tierlist/:uid or use api/tierlists to get all' })
})

router.post('/', async (req, res) => {
    const { token } = req.query
    const { tierlist } = req.body

    if (typeof token !== "string") {
        return res.status(400).json({ message: 'Invalid Token Type' })
    }
    const id = await createTierlist(tierlist, token)
    res.status(201).json(await getTierlistByID(id.toString()))
})

router.get('/:uid', async (req, res) => {
    const id = req.params.uid
    const { token } = req.query
    if (token && typeof token !== "string" ) {
        return res.status(400).json({ message: 'Invalid Token Type' })
    }
    const access = await checkAccess(id, token)
    if (access == "DENIED") {
        return res.status(400).json({ message: 'Access Denied' })
    }
    const tierlist = await getTierlistByID(id)
    if (tierlist == null) {
        return res.status(500).json({ message: 'Tierlist Not Found' })
    }
    res.status(200).json({tierlist:tierlist, access: access})
})

router.put('/:uid', async (req, res) => {
    const id = req.params.uid
    const { token } = req.query
    const { tierlist } = req.body
    if (typeof token !== "string") {
        return res.status(400).json({ message: 'Invalid Token Type' })
    }
    const access = await checkAccess(id, token)
    if (access == "DENIED") {
        return res.status(400).json({ message: 'Access Denied' })
    }
    if (access == "VIEW") {
        return res.status(400).json({ message: 'CANNOT EDIT Access Denied' })
    }
    await updateTierlist(tierlist)
    res.status(201).json(tierlist)
})

router.delete('/:uid', async (req, res) => {
    const id = req.params.uid
    const { token } = req.query
    if (typeof token !== "string") {
        return res.status(400).json({ message: 'Invalid Token Type' })
    }
    const access = await checkAccess(id, token)
    if (access == "DENIED") {
        return res.status(400).json({ message: 'Access Denied' })
    }
    if (access != "OWNER") {
        return res.status(400).json({ message: 'CANNOT DELETE Access Denied' })
    }
    await deleteTierlist(id)
    res.status(200).json({ message: 'Succesfully Deleted' })
})

export default router;