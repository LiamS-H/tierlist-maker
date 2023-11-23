import { Routes, Route, BrowserRouter,  } from "react-router-dom";

import ErrorBoundary from "./error";
import Home from "./home";
import Tierlist from "./tierlist";

export default function Root() {
    return (<>
    <BrowserRouter>
        <Routes>
            <Route path="/" Component={Home} />
            <Route path="/tierlist/:id" Component={Tierlist} />
            <Route path='*' element={<ErrorBoundary />}/>
        </Routes>
    </BrowserRouter>
    </>)
}