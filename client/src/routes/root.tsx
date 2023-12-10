import { Routes, Route, BrowserRouter,  } from "react-router-dom";


import ErrorBoundary from "./error";
import Home from "./home";
import Tierlist from "./tierlist";
import Login from "./login";
import NavBar from "./navbar";
import Shared from "./shared";
import Public from "./public";

import { useAuth} from "../hooks/auth";
import { AuthContext } from "../contexts/auth";

import { useSnackbarContext } from "../hooks/snackbar";
import { SnackbarContext } from "../contexts/snackbar";
import SnackbarFromContext from "../components/Snackbar";


export default function Root() {
    const authContext = useAuth()
    const snackbarContext = useSnackbarContext()
    return (<>
    <AuthContext.Provider value={authContext}>
    <SnackbarContext.Provider value={snackbarContext}>
        <BrowserRouter>
            <NavBar />
            <Routes>
                <Route path="/" Component={Home} />
                <Route path="/Public" Component={Public} />
                <Route path="/tierlist/:id" Component={Tierlist} />
                <Route path="/login" Component={Login} />
                <Route path="/shared" Component={Shared} />
                <Route path='*' element={<ErrorBoundary />}/>
                
            </Routes>
            <SnackbarFromContext/>
        </BrowserRouter>
    </SnackbarContext.Provider>
    </AuthContext.Provider>
    </>)
}