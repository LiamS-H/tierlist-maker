import { Routes, Route, BrowserRouter,  } from "react-router-dom";


import ErrorBoundary from "./error";
import Home from "./home";
import Tierlist from "./tierlist";
import Login from "./login";
import NavBar from "./navbar";

import { useAuth} from "../hooks/auth";
import { AuthContext } from "../contexts/auth";

export default function Root() {
    const authContext = useAuth()
    return (<>
    <AuthContext.Provider value={authContext}>
        <BrowserRouter>
            <NavBar />
            <Routes>
                <Route path="/" Component={Home} />
                <Route path="/tierlist/:id" Component={Tierlist} />
                <Route path="/login" Component={Login} />
                <Route path='*' element={<ErrorBoundary />}/>
                
            </Routes>
        </BrowserRouter>
        
    </AuthContext.Provider>
    </>)
}