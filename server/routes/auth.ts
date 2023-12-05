import express from "express";
import { login } from "../models/user";


const router = express.Router();

router.get('/', async (req, res) => {
    const { email, password } = req.query
    if (typeof email != "string") {
        return res.status(400).json({message:"invalid credentials"})
    }
    if (typeof password != "string") {
        return res.status(400).json({message:"invalid credentials"})
    }

    const user = await login(email, password)
    if (user == null) {
        return res.status(400).json({message:"invalid credentials"})
    }
    
    res.status(200).json(user)
})

export default router;