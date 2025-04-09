
import './App.css'
import {BrowserRouter, Route, Routes,} from "react-router";
import Authentification from "./components/auth/Authentification.jsx";
import Scan from "./components/scan/Scan.jsx";
import PayCart from "./components/payCart/PayCart.jsx";
import History from "./components/history/History.jsx";

function App() {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route index element={<Authentification/>}/>
                    <Route path={"/scan"} element={<Scan/>}/>
                    <Route path={"/pay/cart"} element={<PayCart/>}/>
                    <Route path={"/history"} element={<History/>}/>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
