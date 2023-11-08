import { open } from "sqlite"
import sqlite3 from "sqlite3"
import { AsyncDatabase } from "promised-sqlite3"
import fs from "fs"

const reset = `
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS tierlist;
    DROP TABLE IF EXISTS user_tierlist_sharing;
    DROP TABLE IF EXISTS item_tierlist_model;
    DROP TABLE IF EXISTS item;
    DROP TABLE IF EXISTS tierlist_tiers;
    DROP TABLE IF EXISTS collections;
    DROP TABLE IF EXISTS tierlist_settings;
    DROP TABLE IF EXISTS visibilities;
`

const schema = fs.readFileSync('./queries/schema.sql').toString()


const load = fs.readFileSync('./queries/loadTestData.sql').toString()

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