import { openDB } from "../config/db"

interface Item {
    _id: number,
    item_name: string,
    item_img: string,
    rating: number
}

interface Tiers {
    [key:number] : string
}

interface Tierlist {
    _id: number,
    name: string,
    owner: string,
    created_at: string,
    items?: Item[],
    visibility: string
    tiers?: Tiers
}

async function checkAccess(tierlist_id: string, user_id: string): Promise<"DENIED" | "EDIT" | "VIEW"> {
    const db = await openDB()
    let row;
    row = await db.get<{visibility: string, owner:string}>(`
        SELECT visibilities.name as visibility, tierlist.owner as owner
        FROM tierlist
        INNER JOIN tierlist_settings on tierlist_settings.tierlist_id = tierlist.tierlist_id
        INNER JOIN visibilities on visibilities.visibility = tierlist_settings.visibility
        WHERE tierlist.tierlist_id = ( ? )
    `, [tierlist_id])
    if (row == undefined) {await db.close(); return "DENIED"}
    const { visibility, owner } = row
    
    row = await db.get<{can_edit: string}>(`
        SELECT can_edit FROM user_tierlist_sharing
        WHERE tierlist_id=(?) AND user_uuid=(?)
    `, [tierlist_id, user_id])
    const can_edit = row?.can_edit
    
    await db.close()
    
    if (owner == user_id) { return "EDIT" }
    if (can_edit) { return "EDIT" }
    if (visibility == "Private" && can_edit == undefined) { return "DENIED" }
    return "VIEW"
}

async function updateTierList(tierlist: Tierlist, user_id: string) {
    const db = await openDB()
    await db.run(`
        UPDATE tierlist set tierlist_name = ( ? )
        WHERE tierlist.tierlist_id = ( ? )
    `, [tierlist.name, tierlist._id])
    
    await db.run(`
        UPDATE tierlist_settings set visibility = ( ? )
        WHERE tierlist_id = ( ? )
    `, [tierlist.visibility, tierlist._id])
    
    
    if (tierlist.tiers) {
        await db.run(`
        DELETE FROM tierlist_tiers
        WHERE tierlist_id = ( ? )
        `, [tierlist._id])
        const rows: (string | number)[] = []
        for (let tier_value in tierlist.tiers) {
            rows.push(tierlist._id)
            rows.push(tier_value)
            rows.push(tierlist.tiers[tier_value])
        }

        await db.run(`
        INSERT INTO tierlist_tiers ( tierlist_id, tier_value, tier_row_name )
        VALUES ${Array(Object.keys(tierlist.tiers).length).fill('( ?, ?, ? )').join(',')}
        `, rows)
    }
    if (tierlist.items) {
        await db.run(`
        DELETE FROM item_tierlist_model
        WHERE tierlist_id = ( ? )
        `, [tierlist._id])
        const rows: number[] = []
        tierlist.items.forEach((item)=>{
            rows.push(tierlist._id)
            rows.push(item._id)
            rows.push(item.rating)
        })
        console.log(rows)
        await db.run(`
        INSERT INTO item_tierlist_model ( tierlist_id, item_id, rating )
        VALUES ${Array(tierlist.items.length).fill('( ?, ?, ? )').join(',')}
        `, rows)
    }
    
}

async function getTierlistByID(tierlist_id: string, user_id: string): Promise<Tierlist> {
    const db = await openDB()
    const tierlist: Tierlist = await db.get<Tierlist>(`
    SELECT tierlist.tierlist_id as _id,
        tierlist.tierlist_name as name,
        users.username as owner,
        tierlist.created_at,
        visibilities.visibility as visibility
    FROM tierlist
        INNER JOIN users on users.user_uuid = tierlist.owner
        INNER JOIN tierlist_settings on tierlist.tierlist_id = tierlist_settings.tierlist_id
        INNER JOIN visibilities on tierlist_settings.visibility = visibilities.visibility
    WHERE _id = ( ? )
    `, [tierlist_id])
    
    const items: Item[] = await db.all<Item>(`
    SELECT item.item_id as _id, item_name, item_img, item_tierlist_model.rating
    FROM tierlist
        INNER JOIN item_tierlist_model on tierlist.tierlist_id = item_tierlist_model.tierlist_id
        INNER JOIN item on item.item_id = item_tierlist_model.item_id
    WHERE tierlist.tierlist_id = (?)
    `, tierlist_id)

    const tiers: Tiers = {};
    const rows = await db.all<{number: number, name:string}>(`
    SELECT tier_value as number, tier_row_name as name
    FROM tierlist
        INNER JOIN tierlist_tiers on tierlist.tierlist_id = tierlist_tiers.tierlist_id
    WHERE tierlist.tierlist_id = (?)
    `, tierlist_id)
    rows.forEach(row => {tiers[row.number] = row.name});

    tierlist.items = items
    tierlist.tiers = tiers
    return tierlist
}

export { Tierlist, Item, Tiers, getTierlistByID, checkAccess, updateTierList }