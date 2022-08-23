import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GlobalStyle from './utils/style/GlobalStyle';



import Header from './components/Header';
import SignupBox from './components/SignupBox';
import LoginBox from './components/LoginBox';
import Home from './pages/Home';
import Profile from './pages/Profile';

function App() {

    //const token = Cookie.get('token');
    // console.log(token);

    return (
        <BrowserRouter>
            <GlobalStyle />
            <Header />
            <Routes>
                {/* {!token && (
                    <>
                    <Route path="/signup" element={<SignupBox  />}/>
                    <Route path="/login" element={<LoginBox />}/> 
                    </>
                )}
                {token && (
                    <>
                    <Route path="/home" element={<Home />}/> 
                    <Route path="/profile" element={<Profile />}/>
                    </>
                )}
                <Route path='*' element={<Navigate to={token ? "/home" : "/login"}/>}/> */}
                <Route path="/signup" element={<SignupBox  />}/>
                <Route path="/login" element={<LoginBox />}/> 
                <Route path="/home" element={<Home />}/> 
                <Route path="/profile" element={<Profile />}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;