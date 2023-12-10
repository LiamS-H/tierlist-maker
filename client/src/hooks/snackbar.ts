import { useState, useContext } from 'react';
import { ISnackbar, ISnackbarContext, SnackbarContext } from '../contexts/snackbar';

function useSnackbarContext() {
    const [snackbar, setSnackbar] = useState<ISnackbar>({
        message:"",
        severity:"error",
        open:false
    })
    const context:ISnackbarContext = {
        snackbar: snackbar,
        setSnackbar: setSnackbar
    }
    
    return context
}

function useSnackbar() {
    const { snackbar, setSnackbar } = useContext(SnackbarContext)
    function closeSnackbar() {
        setSnackbar((snackbar)=>({...snackbar, open:false}))
    }
    function raiseWarn(message:string) {
        setSnackbar({severity:"warning", message:message, open:true})
    }
    function raiseError(message:string) {
        setSnackbar({severity:"error", message:message, open:true})
    }
    function raiseInfo(message:string) {
        setSnackbar({severity:"info", message:message, open:true})
    }
    function raiseSuccess(message:string) {
        setSnackbar({severity:"success", message:message, open:true})
    }

    return {raiseWarn, raiseError, raiseInfo, raiseSuccess, closeSnackbar, snackbar}
}

export { useSnackbar, useSnackbarContext }