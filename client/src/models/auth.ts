import { User } from '../../../server/models/user'

type IAuthUser = User
interface IAuthContext {
    user: IAuthUser | null,
    logout: ()=>void,
    login: (email:string,passwore:string)=>Promise<"SUCCESS"|"FAILURE">
}
export type  { IAuthUser, IAuthContext }