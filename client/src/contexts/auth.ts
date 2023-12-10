import { createContext } from "react";
import { IAuthContext } from "../models/auth";

const AuthContext = createContext<IAuthContext>({
    user: null,
    logout: ()=>{},
    login: async()=>("FAILURE")
})

export {AuthContext}