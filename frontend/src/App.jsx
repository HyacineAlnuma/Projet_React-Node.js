import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GlobalStyle from './utils/style/GlobalStyle';



import Header from './components/Header';
import SignupBox from './components/SignupBox';
import LoginBox from './components/LoginBox';
import Home from './pages/Home';
import Profile from './pages/Profile';

function App() {

    return (
        <BrowserRouter>
            <GlobalStyle />
            <Header />
            <Routes>
                <Route path="/signup" element={<SignupBox  />}/>
                <Route path="/login" element={<LoginBox />}/> 
                <Route path="/home" element={<Home />}/> 
                <Route path="/profile" element={<Profile />}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;