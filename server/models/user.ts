import { openDB } from "../config/db"

interface User {
    user_uuid: string,
    username: string,
    email: string,
    created_at: string,
}

async function login(email: string, password: string): Promise<User | null> {
    const db = await openDB()
    const user = await db.get<User>(`
    SELECT user_uuid, username, email, created_at
    FROM users
    WHERE email=( ? ) AND password=( ? )
    `, [email, password])
    if (!user) return null;
    return user
}

async function findUser(username: string): Promise<User | null> {
    const db = await openDB()
    const user = await db.get<User>(`
    SELECT user_uuid, username, email, created_at
    FROM users
    WHERE username LIKE "%"||(?)||"%"
    `, [username])
    if (!user) return null;
    return user
}

export type {User}
export {login, findUser}