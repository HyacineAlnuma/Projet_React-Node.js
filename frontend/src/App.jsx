import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GlobalStyle from './utils/style/GlobalStyle';
// import Cookie from 'js-cookie';


import Header from './components/Header';
import SignupBox from './components/SignupBox';
import LoginBox from './components/LoginBox';
import Home from './pages/Home';
import Profile from './pages/Profile';

function App() {
    const [auth, setAuth] = useState(false);
    // const token = Cookie.get('token');
    // console.log(token);

    return (
        <BrowserRouter>
            <GlobalStyle />
            <Header auth={auth} setAuth={setAuth} />
            <Routes>
                {!auth && (
                    <>
                    <Route path="/signup" element={<SignupBox auth={auth} setAuth={setAuth} />}/>
                    <Route path="/login" element={<LoginBox auth={auth} setAuth={setAuth} />}/> 
                    </>
                )}
                {auth && (
                    <>
                    <Route path="/home" element={<Home />}/> 
                    <Route path="/profile" element={<Profile />}/>
                    </>
                )}
                <Route path='*' element={<Navigate to={auth ? "/home" : "/login"}/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;