import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GlobalStyle from './utils/style/GlobalStyle'

import Header from './components/Header';
import SignupBox from './components/SignupBox';
import LoginBox from './components/LoginBox';
import Home from './pages/Home';

function App() {
    const [token, setToken] = useState('');

    return (
        <BrowserRouter>
            <GlobalStyle />
            <Header token={token} setToken={setToken}/>
            <Routes>
                {!token && (
                    <>
                    <Route path="/signup" element={<SignupBox token={token} setToken={setToken}/>}/>
                    <Route path="/login" element={<LoginBox token={token} setToken={setToken}/>}/> 
                    </>
                )}
                {token && (
                    <Route path="/home" element={<Home />}/> 
                )}
                <Route path='*' element={<Navigate to={token ? "/home" : "/login"}/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;