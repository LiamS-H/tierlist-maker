import {Tierlist, Item, Tier, Access} from '../../../server/models/tierlist'

type ITierlist = Tierlist
type IItem = Item
type ITier = Tier
type IAccess = Access | "LOADING"

export type {ITierlist, IItem, ITier, IAccess}
export  {}