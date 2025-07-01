import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./components/login/login";
import Signin from "./components/login/Signin";
import SubscribePage from "./pages/subscribe/subscribe";
import Liste from "./components/liste/liste";
import Error from "./components/error/error";
import { useLocation } from 'react-router-dom'
import Header from "./components/header/header"
import DropDowns from "../src/components/faq/dropdowns"



function RoutesApp () {
    const location = useLocation();
    const isLoginPageOn = location.pathname === '/login' || location.pathname === '/signin' || location.pathname === '/' || location.pathname === '/subscribe';
    

    return (
        <>
            {!isLoginPageOn && <Header />}
            <main>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/home" element={<Home/>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signin" element={<Signin />} />
                    <Route path="/subscribe" element={<SubscribePage />} />
                    <Route path="/liste" element={<Liste />} />
                    <Route path="/search" element={<Home />} />
                    <Route path="/help" element={<DropDowns />} />
                    <Route path="*" element={<Error />} />
                </Routes>
            </main>
        </>
    );
}

export default RoutesApp;