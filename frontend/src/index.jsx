import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalStyle from './utils/style/GlobalStyle'

import Header from './components/Header';
import SignupBox from './components/SignupBox';
import LoginBox from './components/LoginBox';
import Home from './pages/Home';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <GlobalStyle />
            <Header />
            <Routes>
                <Route path="/signup" element={<SignupBox />}/>
                <Route path="/login" element={<LoginBox />}/> 
                <Route path="/home" element={<Home />}/> 
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

