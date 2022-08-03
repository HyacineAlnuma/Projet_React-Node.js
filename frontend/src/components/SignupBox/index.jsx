import React, {useState} from 'react';
import axios from 'axios';
import styled from 'styled-components';
import colors from '../../utils/style/colors';
import { FiMail, FiDownload } from "react-icons/fi";
import { BiKey } from "react-icons/bi";

const FormBox = styled.div `
    margin: auto;
    margin-top: 5%;
    padding: 40px;
    height: 650px;
    width: 450px;
    background-color: ${colors.backgroundWhite};
    border-radius: 16px;
    box-shadow: 1px 1px 200px #DFDFDF;
    position: relative;
`;

const StyledTitle = styled.h2 `
    text-align: center;
    font-size: 1.8rem;
    margin-bottom: 40px;
`;

const StyledForm = styled.form `
    display: flex;
    flex-direction: column;
    gap: 50px;
    justify-content: center;
    align-items: center;
`;

const StyledInput = styled.input `
    width: 60%;
    height: 60px;
    padding-left: 50px;
    font-size: 1.2rem;
    border: 0;
    outline: 0;
    border-bottom: 1px solid ${colors.tertiary};
    transition: 400ms ease-out;
    &:focus {
        width: 75%;
        padding-left: 78px;
    }
`;

const UsernameInput = styled.input `
    width: 60%;
    height: 60px;
    padding-left: 10px;
    font-size: 1.2rem;
    border: 0;
    outline: 0;
    border-bottom: 1px solid ${colors.tertiary};
    transition: 400ms ease-out;
    &:focus {
        width: 75%;
        padding-left: 38px;
    }
`;

const StyledBtn = styled.input `
    width: 200px;
    height: 50px;
    font-size: 1.1rem;
    background-color: ${colors.primary};
    color: ${colors.backgroundWhite};
    border: 0px;
    border-radius: 40px;
    position: absolute;
    bottom: 40px;
    left: 28%;
    &:hover {
        cursor: pointer;
    } 
`;

const EmailWrapper = styled.div `
    position: absolute;
    left: 120px;
    top: 132px;
`;

const KeyWrapper = styled.div `
    position: absolute;
    left: 120px;
    top: 239px;
`;

const PictureWrapper = styled.div `
    display: flex;
    width: 60%;
    height: 50px;
    p {
        font-size: 1.2rem;
        color: #747474;
        padding: 10px;
    }
    button {
        height: 25px;
        width: 40px;
        padding: 2px;
        position: absolute;
        bottom: 20px;
        right: 20px;
        &:hover {
            cursor: pointer;
        }
    }
    border-bottom: 1px solid ${colors.tertiary};
    position: relative;
`;


function SignupBox() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const userData = {
        email: email,
        password: password,
        username: username,
        role: "basicUser"
    }

    function handleSubmit(e) {
        e.preventDefault();
        axios.post('http://localhost:3000/api/auth/signup', userData)
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }

    return (
        <FormBox>
            <StyledTitle>Créer un compte</StyledTitle>
            <EmailWrapper><FiMail size={23}/></EmailWrapper>
            <KeyWrapper><BiKey size={27}/></KeyWrapper>
            <StyledForm action="" onSubmit={handleSubmit}>
                <StyledInput type="email" placeholder='Adresse email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
                <StyledInput type="password" placeholder='Mot de passe' value={password} onChange={(e) => setPassword(e.target.value)} required/>
                <UsernameInput type="text" placeholder="Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                <PictureWrapper>
                    <p>Photo de profil</p>
                    <button><FiDownload /></button>
                </PictureWrapper>
                <StyledBtn type="submit" value="Créer un compte"/>
            </StyledForm>
        </FormBox>
    );
}

export default SignupBox;