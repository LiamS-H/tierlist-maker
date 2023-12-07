import { openDB } from "../config/db"

type Access = "OWNER" | "DENIED" | "EDIT" | "VIEW"

interface Item {
    _id: number,
    item_name: string,
    item_img: string,
}

interface Items {
    [key:number] : Item
}

interface Tier {
    _id: number,
    name: string,
    items: number[]
}

interface Tiers {
    [key:number] : Tier
}

interface Tierlist {
    _id: number,
    name: string,
    owner: string,
    created_at: string,
    items: Items,
    visibility: string
    tiers: Tiers,
}

async function searchPublicTierlists(query: string, offset = 0): Promise<Tierlist[]> {
    const db = await openDB()
    const tierlists = await db.all<Tierlist>(`
    SELECT tierlist.tierlist_id as _id,
        tierlist.tierlist_name as name,
        users.username as owner,
        tierlist.created_at as created_at,
        visibilities.name as visibility
    FROM tierlist
        INNER JOIN users on users.user_uuid = tierlist.user_uuid
        INNER JOIN tierlist_settings on tierlist.tierlist_id = tierlist_settings.tierlist_id
        INNER JOIN visibilities on tierlist_settings.visibility = visibilities.visibility
    WHERE visibilities.visibility = 0
    AND tierlist.tierlist_name like '%' || ? || '%'
    LIMIT 10 OFFSET (? * 10)
    `, [query, offset])
    return tierlists
}

async function getPublicTierlists(offset = 0): Promise<Tierlist[]> {
    const db = await openDB()
    const tierlists = await db.all<Tierlist>(`
        SELECT tierlist.tierlist_id as _id,
            tierlist.tierlist_name as name,
            users.username as owner,
            tierlist.created_at as created_at,
            visibilities.name as visibility
        FROM tierlist
            INNER JOIN users on users.user_uuid = tierlist.user_uuid
            INNER JOIN tierlist_settings on tierlist.tierlist_id = tierlist_settings.tierlist_id
            INNER JOIN visibilities on tierlist_settings.visibility = visibilities.visibility
        WHERE visibilities.visibility = 0
        LIMIT 10 OFFSET (? * 10)
    `, [offset])
    return tierlists
}

async function getUserTierlists(user_id: string, offset = 0): Promise<Tierlist[]> {
    const db = await openDB()
    const tierlists = await db.all<Tierlist>(`
        SELECT tierlist.tierlist_id as _id,
            tierlist.tierlist_name as name,
            users.username as owner,
            tierlist.created_at as created_at,
            visibilities.name as visibility
        FROM tierlist
            INNER JOIN users on users.user_uuid = tierlist.user_uuid
            INNER JOIN tierlist_settings on tierlist.tierlist_id = tierlist_settings.tierlist_id
            INNER JOIN visibilities on tierlist_settings.visibility = visibilities.visibility
        WHERE tierlist.user_uuid = ( ? )
        LIMIT 10 OFFSET (? * 10)
    `, [user_id, offset])
    return tierlists
}

async function getSharedTierlists(user_id: string, offset = 0): Promise<Tierlist[]> {
    const db = await openDB()
    const tierlists = await db.all<Tierlist>(`
        SELECT tierlist.tierlist_id as _id,
            tierlist.tierlist_name as name,
            users.username as owner,
            tierlist.created_at as created_at,
            visibilities.name as visibility
        FROM user_tierlist_sharing
            INNER JOIN tierlist on tierlist.tierlist_id = user_tierlist_sharing.tierlist_id
            INNER JOIN users on users.user_uuid = tierlist.user_uuid
            INNER JOIN tierlist_settings on tierlist.tierlist_id = tierlist_settings.tierlist_id
            INNER JOIN visibilities on tierlist_settings.visibility = visibilities.visibility
        WHERE user_tierlist_sharing.user_uuid = ( ? )
        LIMIT 10 OFFSET (? * 10)
    `, [user_id, offset])
    return tierlists
}

async function exists(tierlist_id: string) : Promise<boolean> {
    const db = await openDB()
    const { tierlist_exists }= await db.get<{tierlist_exists: number}>(`
        SELECT EXISTS(SELECT 1 FROM tierlist WHERE tierlist_id=( ? ) ) as tierlist_exists;
    `, [tierlist_id])
    return Boolean(tierlist_exists)
}

async function deleteTierlist(tierlist_id: string) {
    const db = await openDB()
    db.run(`
        DELETE FROM tierlist WHERE tierlist_id = ( ? )
    `, [tierlist_id])
}

async function checkAccess(tierlist_id: string, user_id: string | undefined): Promise<Access> {
    const db = await openDB()
    let row;
    row = await db.get<{visibility: string, owner:string}>(`
        SELECT visibilities.name as visibility, tierlist.user_uuid as owner
        FROM tierlist
        INNER JOIN tierlist_settings on tierlist_settings.tierlist_id = tierlist.tierlist_id
        INNER JOIN visibilities on visibilities.visibility = tierlist_settings.visibility
        WHERE tierlist.tierlist_id = ( ? )
    `, [tierlist_id])
    if (row == undefined) {await db.close(); return "DENIED"}
    const { visibility, owner } = row
    if (user_id == undefined && visibility == "Public") return "VIEW"
    if (user_id == undefined && visibility == "Private") return "DENIED"
    if (owner == user_id) {await db.close(); return "OWNER" }
    
    row = await db.get<{can_edit: string}>(`
        SELECT can_edit FROM user_tierlist_sharing
        WHERE tierlist_id=(?) AND user_uuid=(?)
    `, [tierlist_id, user_id])
    const can_edit = row?.can_edit
    
    await db.close()
    if (can_edit) { return "EDIT" }
    if (visibility == "Private" && can_edit == undefined) { return "DENIED" }
    return "VIEW"
}

async function updateTierlist(tierlist: Tierlist) {
    const db = await openDB()
    await db.run(`
        UPDATE tierlist set tierlist_name = ( ? )
        WHERE tierlist.tierlist_id = ( ? )
    `, [tierlist.name, tierlist._id])
    
    await db.run(`
        UPDATE tierlist_settings set visibility = (SELECT visibility FROM visibilities WHERE name = ( ? ))
        WHERE tierlist_id = ( ? )
    `, [tierlist.visibility, tierlist._id])
    
    
    if (tierlist.tiers) {
        await db.run(`
        DELETE FROM tierlist_tiers
        WHERE tierlist_id = ( ? )
        `, [tierlist._id])
        const rows: (string | number)[] = []
        for (let tier_id in tierlist.tiers) {
            rows.push(tierlist._id)
            rows.push(tier_id)
            rows.push(tierlist.tiers[tier_id].name)
        }

        await db.run(`
        INSERT INTO tierlist_tiers ( tierlist_id, tier_id, tier_row_name )
        VALUES ${Array(Object.keys(tierlist.tiers).length).fill('( ?, ?, ? )').join(',')}
        `, rows)
    }
    if (tierlist.items) {
        await db.run(`
        DELETE FROM item_tierlist_model
        WHERE tierlist_id = ( ? )
        `, [tierlist._id])
        const rows: (string | number)[] = []
        for (let tier_id in tierlist.tiers){
            for (let item_id of tierlist.tiers[tier_id].items) {
                rows.push(tierlist._id)
                rows.push(item_id)
                rows.push(tier_id)
            }
        }
        await db.run(`
        INSERT INTO item_tierlist_model ( tierlist_id, item_id, tier_id )
        VALUES ${Array(rows.length/3).fill('( ?, ?, ? )').join(',')}
        `, rows)
    }
    
}

async function createTierlist(tierlist: Tierlist, user_id: string) : Promise<number> {
    const db = await openDB()
    await db.run(`
        INSERT INTO tierlist ( user_uuid, tierlist_name ) VALUES ( ?, ? )
    `, [user_id, tierlist.name, ])
    const { id } = await db.get<{id:number}>(`select seq as id from sqlite_sequence where name="tierlist"`)
    
    await db.run(`
        INSERT INTO tierlist_settings
        ( visibility, tierlist_id )
        VALUES ( ( SELECT visibility FROM visibilities WHERE name = ( ? ) ), ? )
    `, [tierlist.visibility, id])
    
    
    if (tierlist.tiers) {
        const rows: (string | number)[] = []
        for (let tier_id in tierlist.tiers) {
            rows.push(id)
            rows.push(tier_id)
            rows.push(tierlist.tiers[tier_id].name)
        }

        await db.run(`
        INSERT INTO tierlist_tiers ( tierlist_id, tier_id, tier_row_name )
        VALUES ${Array(Object.keys(tierlist.tiers).length).fill('( ?, ?, ? )').join(',')}
        `, rows)
    }
    if (tierlist.items) {
        const rows: (string | number)[] = []
        for (let tier_id in tierlist.tiers){
            for (let item_id of tierlist.tiers[tier_id].items) {
                rows.push(id)
                rows.push(item_id)
                rows.push(tier_id)
            }
        }
        await db.run(`
        INSERT INTO item_tierlist_model ( tierlist_id, item_id, tier_id )
        VALUES ${Array(rows.length/3).fill('( ?, ?, ? )').join(',')}
        `, rows)
    }
    return id
}

async function getTierlistByID(tierlist_id: string): Promise<Tierlist> {
    const db = await openDB()
    const tierlist: Tierlist = await db.get<Tierlist>(`
    SELECT tierlist.tierlist_id as _id,
        tierlist.tierlist_name as name,
        users.username as owner,
        tierlist.created_at as created_at,
        visibilities.name as visibility
    FROM tierlist
        INNER JOIN users on users.user_uuid = tierlist.user_uuid
        INNER JOIN tierlist_settings on tierlist.tierlist_id = tierlist_settings.tierlist_id
        INNER JOIN visibilities on tierlist_settings.visibility = visibilities.visibility
    WHERE _id = ( ? )
    `, [tierlist_id])
    tierlist.items = {}
    tierlist.tiers = {}

    const tier_rows = await db.all<{_id: number, name:string}>(`
    SELECT tier_id as _id, tier_row_name as name
    FROM tierlist
        INNER JOIN tierlist_tiers on tierlist.tierlist_id = tierlist_tiers.tierlist_id
    WHERE tierlist.tierlist_id = (?)
    `, tierlist_id)
    tier_rows.forEach((row) => {
        tierlist.tiers[row._id] = {_id:row._id, name:row.name, items:[]}
    });
    
    const item_rows = await db.all<{_id: number, item_name:string, item_img:string, tier_id:number}>(`
    SELECT item.item_id as _id, item_name, item_img, item_tierlist_model.tier_id as tier_id
    FROM tierlist
        INNER JOIN item_tierlist_model on tierlist.tierlist_id = item_tierlist_model.tierlist_id
        INNER JOIN item on item.item_id = item_tierlist_model.item_id
    WHERE tierlist.tierlist_id = (?)
    `, tierlist_id)
    item_rows.forEach((row)=>{
        tierlist.items[row._id] = {_id:row._id, item_name:row.item_name, item_img:row.item_img}
        tierlist.tiers[row.tier_id].items.push(row._id)
    })

    return tierlist
}


async function shareTierlist(tierlist_id: string, user_id: string, can_edit: boolean): Promise<void> {
    const db = await openDB()

    await db.run(`INSERT INTO user_tierlist_sharing (tierlist_id, user_uuid, can_edit)
    VALUES (?, ?, ?)
    ON CONFLICT (tierlist_id, user_uuid)
    DO UPDATE SET can_edit = excluded.can_edit;`, [tierlist_id, user_id, can_edit])
    }

export {
    Tierlist, Item, Tier, Access,
    exists, checkAccess,
    getPublicTierlists, searchPublicTierlists, getTierlistByID, getSharedTierlists, getUserTierlists,
    updateTierlist, deleteTierlist, createTierlist, shareTierlist }