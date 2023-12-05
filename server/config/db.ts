import { open } from "sqlite"
import sqlite3 from "sqlite3"
import { AsyncDatabase } from "promised-sqlite3"
import fs from "fs"

const reset = fs.readFileSync('./config/queries/dropAll.sql').toString()

const schema = fs.readFileSync('./config/queries/schema.sql').toString()


const load = fs.readFileSync('./config/queries/loadTestData.sql').toString()

export async function resetDB () {
    const blankdb = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    })
    blankdb.close()
    const db = await AsyncDatabase.open('./database.sqlite')
    console.log("[db]: clearing data...")
    await db.exec(reset)
    console.log("[db]: creating schema...")
    await db.exec(schema)
    console.log("[db]: loading example data...")
    await db.exec(load)
    console.log("[db]: initialized :)")
    await db.close()
}

export async function openDB () {
    return AsyncDatabase.open('./database.sqlite')
}