import { Routes, Route, BrowserRouter,  } from "react-router-dom";

import ErrorBoundary from "./error";
import Home from "./home";

export default function Root() {
    return (<>
    <BrowserRouter>
        <Routes>
            <Route path="/" Component={Home} />
            <Route path='*' element={<ErrorBoundary />}/>
        </Routes>
    </BrowserRouter>
    </>)
}