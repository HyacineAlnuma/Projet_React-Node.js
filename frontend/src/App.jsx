import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalStyle from './utils/style/GlobalStyle';

import Header from './components/Header';
import SignupBox from './components/SignupBox';
import LoginBox from './components/LoginBox';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Error from './components/Error';

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
                <Route path="/" element={<Home />}/> 
                <Route path="*" element={<Error />}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;