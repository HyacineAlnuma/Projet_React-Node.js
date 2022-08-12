import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import colors from '../../utils/style/colors';
import { FiMail } from "react-icons/fi";
import { BiKey } from "react-icons/bi";

const FormBox = styled.div `
    margin: 4% auto;
    padding: 40px;
    min-height: 630px;
    max-height: 850px;
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
    gap: 40px;
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
    top: 132px;
`;

const KeyWrapper = styled.div `
    position: absolute;
    left: 120px;
    top: 229px;
`;

const PictureTitle = styled.p `
    width: 60%;
    height: 20px;
    padding: 10px 0 0 10px;
    font-size: 1.2rem;
    color: #747474;
    position: relative;
`;

const PictureWrapper = styled.div `
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 70px;
    img {
        width: 100px;
        height: auto;
        margin: auto;
    }
`;


function SignupBox({ token, setToken }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [file, setFile] = useState();
    const [image, setImage] = useState('');
    const navigate = useNavigate();

    function imageHandler(e) {
        let files = Array.from(e.target.files);
        console.log(files);
        setFile(files[0]);
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = () => {
            console.log(reader.result);
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
            .then(res => 
                setToken(res.data.token),
                navigate('/home'),
                console.log(token)
                )
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
                <PictureTitle>Photo de profil</PictureTitle>
                <PictureWrapper>
                    <input type="file" onChange={(e) => {imageHandler(e)}}/>
                    { image !== '' && <img src={image} alt="" /> }
                </PictureWrapper>
                <StyledBtn type="submit" value="Créer un compte"/>
            </StyledForm>
        </FormBox>
    );
}

export default SignupBox;