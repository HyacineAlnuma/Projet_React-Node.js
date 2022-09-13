import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import colors from '../../utils/style/colors';
import { FiMail } from "react-icons/fi";
import { BiKey } from "react-icons/bi";
import setCookie  from '../../utils/hooks/SetCookie';
import CryptoJS from 'crypto-js';

const FormBox = styled.div `
    margin: auto;
    margin-top: 8%;
    padding: 40px;
    height: 500px;
    width: 450px;
    background-color: ${colors.backgroundWhite};
    color: ${colors.tertiary};
    border-radius: 16px;
    box-shadow: 1px 1px 200px #DFDFDF;
    position: relative;
    @media all and (max-width: 540px) {
        width: 100%;
    }
`;

const StyledTitle = styled.h2 `
    text-align: center;
    font-size: 1.8rem;
    margin-bottom: 40px;
`;

const StyledForm = styled.form `
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const StyledInput = styled.input `
    width: 60%;
    margin: 25px 0;
    height: 60px;
    padding-left: 50px;
    font-size: 1.2rem;
    color: ${colors.tertiary};
    border: 0;
    outline: 0;
    border-bottom: 1px solid ${colors.tertiary};
    transition: 400ms ease-out;
    &:focus {
        width: 75%;
        padding-left: 78px;
    }
    @media all and (max-width: 540px) {
        width: 90%;
        padding-left: 35px;
        &:focus {
            width: 90%;
            padding-left: 35px;
        }
    }
`;

const StyledBtn = styled.input `
    width: 200px;
    height: 50px;
    font-size: 1.1rem;
    background-color: ${colors.secondary};
    color: ${colors.primary};
    border: 0px;
    border-radius: 40px;
    position: absolute;
    bottom: 40px;
    left: 28%;
    transition: 150ms;
    &:hover {
        cursor: pointer;
        background-color: ${colors.primary};
        color: ${colors.backgroundWhite};
    } 
`;

const EmailWrapper = styled.div `
    position: absolute;
    left: 120px;
    top: 157px;
    @media all and (max-width: 540px) {
        left: 60px;
    }
`;

const KeyWrapper = styled.div `
    position: absolute;
    left: 120px;
    top: 265px;
    @media all and (max-width: 540px) {
        left: 60px;
    }
`;

function LoginBox() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    
    const userData = {
        email: email,
        password: password
    }

    function handleSubmit(e) {
        e.preventDefault();
        axios.post('http://localhost:4200/api/auth/login', userData)
            .then(res => {
                    localStorage.setItem('userId', res.data.userId);
                    localStorage.setItem('username', res.data.username);
                    localStorage.setItem('pictureUrl', res.data.pictureUrl);
                    const passphrase = 'eDgf52LopfXCvs8dsfg456LmsifBs785';
                    const encryptedToken = CryptoJS.AES.encrypt(res.data.token, passphrase).toString();
                    setCookie('token', encryptedToken);
                    const encryptedUserRole = CryptoJS.AES.encrypt(res.data.userRole, passphrase).toString();
                    setCookie('userRole', encryptedUserRole);
                    navigate('/home');
                    console.log(res);
                }
            )
            .catch(err => {
                console.log(err);
                window.alert(JSON.stringify(err.response.data.message));
            })
    }

    return (
        <FormBox>
            <StyledTitle>Se connecter</StyledTitle>
            <EmailWrapper><FiMail size={23}/></EmailWrapper>
            <KeyWrapper><BiKey size={27}/></KeyWrapper>
            <StyledForm action="" onSubmit={handleSubmit} >
                <StyledInput type="email" placeholder='Adresse email' value={email} onChange={(e) => {setEmail(e.target.value)}} />
                <StyledInput type="password" placeholder='Mot de passe' value={password} onChange={(e) => {setPassword(e.target.value)}} />
                <StyledBtn type="submit" value="Se connecter"/>
            </StyledForm>
        </FormBox>
    );
}

export default LoginBox;