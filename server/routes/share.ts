import express from "express";
import { Tierlist, exists, getTierlistByID, checkAccess, shareTierlist } from "../models/tierlist";
import { findUser } from "../models/user";


const router = express.Router();

router.get('/', async (req, res) => {
    res.status(400).json({ message: 'Specify sharing with api/share/:uid' })
})

router.put('/:uid', async (req, res) => {
    const tierlist_id = req.params.uid
    const { token } = req.query
    const { username, can_edit } = req.body
    if (typeof token !== "string") {
        return res.status(400).json({ message: 'Invalid Token Type' })
    }
    const access = await checkAccess(tierlist_id, token)
    if (access == "DENIED") {
        return res.status(400).json({ message: 'Access Denied' })
    }
    if (access != "OWNER") {
        return res.status(400).json({ message: 'Must Be Owner Access Denied' })
    }
    
    const user = await findUser(username)
    if (user == null) {
        return res.status(400).json({ message: 'User Not Found' })
    }
    await shareTierlist(tierlist_id, user.user_uuid, can_edit)
    res.status(200).json({message:"success!"})
})

export default router;