import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import colors from '../../utils/style/colors';
import { FiMail } from "react-icons/fi";
import { BiKey, BiDownload, BiImage } from "react-icons/bi";
import { BsFillPersonFill } from "react-icons/bs";


const FormBox = styled.div `
    margin: 4% auto;
    padding: 40px;
    min-height: 630px;
    max-height: 850px;
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
    gap: 40px;
    justify-content: center;
    align-items: center;
`;

const StyledInput = styled.input `
    width: 70%;
    height: 60px;
    color: ${colors.tertiary};
    padding-left: 50px;
    font-size: 1rem;
    border: 0;
    outline: 0;
    border-bottom: 1px solid ${colors.tertiary};
    transition: 400ms ease-out;
    &:focus {
        width: 85%;
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

const IconWrapper = styled.div `
    position: absolute;
    left: 105px;
    top: 329px;
    ${(props) => props.type === 'email' &&
        `top: 132px;`
    };
    ${(props) => props.type === 'key' &&
        `top: 229px;`
    };
    ${(props) => props.type === 'person' &&
        `top: 329px;`
    };
    ${(props) => props.type === 'image' &&
        `top: 421px;`
    };
    @media all and (max-width: 540px) {
        left: 60px;
    }
`;

const PictureTitle = styled.p `
    width: 60%;
    height: 20px;
    padding: 10px 0 0 30px;
    font-size: 1rem;
    color: #747474;
    position: relative;
`;

const PictureWrapper = styled.div `
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 70px;
    position: relative;
    img {
        width: 100px;
        height: auto;
        margin: auto;
    }
    input[type="file"] {
        visibility: hidden;
        position: absolute;
        width: 0;
    }
    label {
        color: ${colors.primary};
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap 10px;
        
    }
`;


function SignupBox() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [file, setFile] = useState();
    const [image, setImage] = useState('');
    const navigate = useNavigate();

    function imageHandler(e) {
        let files = Array.from(e.target.files);
        setFile(files[0]);
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = () => {
            setImage(reader.result?.toString() ?? '');
        };
    }

    function handleSubmit(e) {
        e.preventDefault();
        const userData = new FormData();
        userData.append('email', email);
        userData.append('password', password);
        userData.append('username', username);
        userData.append('userRole', 'basicUser');
        userData.append('pictureUrl', file);
        axios.post('http://localhost:4200/api/auth/signup', userData)
            .then(res => {
                navigate('/login');
                window.alert('Votre compte a bien été créé !');
                })
            .catch(err => {
                console.log(err);
                window.alert(JSON.stringify(err.response.data.message));
            })
    }

    return (
        <FormBox>
            <StyledTitle>Créer un compte</StyledTitle>
            <IconWrapper type='email'><FiMail size={23}/></IconWrapper>
            <IconWrapper type='key'><BiKey size={27}/></IconWrapper>
            <IconWrapper type='person'><BsFillPersonFill size={26}/></IconWrapper>
            <IconWrapper type='image'><BiImage size={26}/></IconWrapper>
            <StyledForm action="" onSubmit={handleSubmit}>
                <StyledInput type="email" placeholder='Adresse email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
                <StyledInput type="password" placeholder='Mot de passe' value={password} onChange={(e) => setPassword(e.target.value)} required/>
                <StyledInput type="text" placeholder="Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                <PictureTitle>Photo de profil</PictureTitle>
                <PictureWrapper>
                    <label htmlFor="files"><BiDownload size={22}/> Importer une image</label>
                    <input id='files' type="file" onChange={(e) => {imageHandler(e)}}/>
                    { image !== '' && <img src={image} alt="" /> }
                </PictureWrapper>
                <StyledBtn type="submit" value="Créer un compte"/>
            </StyledForm>
        </FormBox>
    );
}

export default SignupBox;