import {Tierlist, Item, Tier, Access} from '../../../server/models/tierlist'

// _id: number,
// name: string,
// owner: string,
// created_at: string,
// items: Items,
// visibility: string,
// tiers: Tiers,

type ITierlist = Tierlist
type IItem = Item
type ITier = Tier
type IAccess = Access | "LOADING"

export type {ITierlist, IItem, ITier, IAccess}
export  {}