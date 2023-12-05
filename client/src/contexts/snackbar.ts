import { createContext, Dispatch, SetStateAction } from "react";


interface ISnackbar {
    message:string,
    severity:"info"|"error"|"warning"|"success"
    open:boolean
}

interface ISnackbarContext {
    snackbar: ISnackbar,
    setSnackbar: Dispatch<SetStateAction<ISnackbar>>
}

const SnackbarContext = createContext<ISnackbarContext>({
    snackbar: {
        message:"",
        severity:"error",
        open:false
    },
    setSnackbar: ()=>{}
})

export { SnackbarContext }
export type { ISnackbar, ISnackbarContext }