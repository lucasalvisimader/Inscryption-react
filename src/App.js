import './App.css';
import React from "react";
import Navbar from "./components/nav/Nav";
import Login from "./components/login/Login"
import 'bootstrap/dist/css/bootstrap.min.css';
import {Routes, BrowserRouter, Route} from "react-router-dom";
import UserRegister from "./components/user-register/User-register";
import ShowOneCard from './components/admin/show-one-card/Show-one-card';
import CardRegister from './components/admin/card-register/Card-register';
import ShowAllCards from './components/admin/show-all-cards/Show-all-cards';

function App() {
    return(
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route index element={<Login />} />
                <Route path="/login" element={<Login />}/>
                <Route path="/card-register" element={<CardRegister />}/>
                <Route path="/user-register" element={<UserRegister />}/>
                <Route path="/show-all-cards" element={<ShowAllCards card={{}} />}/>
                {/* <Route path="/show-one-card" element={<ShowOneCard />}/> */}
            </Routes>
        </BrowserRouter>
    )
}

export default App;
