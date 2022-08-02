import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalStyle from './utils/style/GlobalStyle'

import Header from './components/Header';
import SignupBox from './components/SignupBox';
import LoginBox from './components/LoginBox';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <GlobalStyle />
            <Header />
            <Routes>
                <Route path="/" element={<SignupBox />}/>
                <Route path="/login" element={<LoginBox />}/> 
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

