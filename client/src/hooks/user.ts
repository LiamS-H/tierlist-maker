import { createContext, useContext, useEffect, useState } from "react";

const userContext = createContext<IUser | undefined>(undefined)

interface IUser {
    token: string,
    username: string,
}

function useUser() {
    const user = useContext(userContext)

    return user
}

export type { IUser, useUser }


