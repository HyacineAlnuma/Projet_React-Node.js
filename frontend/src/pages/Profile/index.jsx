import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { BiDownload } from 'react-icons/bi';
import { AiFillCloseCircle } from 'react-icons/ai';
import colors from '../../utils/style/colors';
import Cookie from 'js-cookie';
import CryptoJS from 'crypto-js';
import Utf8 from 'crypto-js/enc-utf8';

const ProfileBox = styled.form `
    width: 50%;
    margin: auto;
    display: flex:
    flex-direction: column;
    color: ${colors.tertiary};
    p {
        margin-top: 8px;
        font-size: 0.8rem;
        color: #A9A9A9;
    }
    img {
        width: 200px;
        height: auto;
    }
    label {
        color: ${colors.primary};
        font-size: 1.1rem;
        width: 250px;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap 10px;
    }
    input[type="file"] {
        visibility: hidden;
    }
    .imageWrapper {
        display: flex;
    }
    .cancelbtn {
        background-color: ${colors.backgroundLight};
        color: ${colors.tertiary};
        padding: 6px 6px 6px 7px;
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        &:hover {
            background-color: #DCDCDC;
            cursor: pointer;
        }
    }
    @media all and (max-width: 680px) {
        width: 100%;
        padding-left: 30px;
    }
`;

const TitleWrapper = styled.div `
    position: relative;
`;

const StyledTitle = styled.h2 `
    margin: 50px 0;
    font-size: 2.1rem;
    font-weight: 600;
    position: relative;
    z-index: 2;
    @media all and (max-width: 904px) {
        font-size: 1.5rem;
    }
    @media all and (max-width: 710px) {
        font-size: 1.1rem;
    }
`;

const TitleUnderline = styled.div `
    height: 13px;
    background-color:${colors.secondary};
    position: absolute;
    top: 25px;
    left: -5px;
    z-index: 0;
    ${(props) => props.number === '1' &&
        `width: 430px;`
    };
    ${(props) => props.number === '2' &&
        `width: 463px;`
    };
    @media all and (max-width: 904px) {
        visibility: hidden;
    }
`;

const StyledInput = styled.input `
    width: 300px;
    height: 60px;
    padding: 0 30px;
    background-color: ${colors.backgroundLight};
    font-size: 1.2rem;
    border: 0;
    outline: 0;
    border-bottom: 1px solid ${colors.tertiary};
    transition: 400ms ease-out;
`;

const StyledBtn = styled.input `
    width: 300px;
    height: 50px;
    margin-top: 60px;
    font-size: 1.1rem;
    background-color: ${colors.secondary};
    color: ${colors.primary};
    border: 0px;
    border-radius: 40px;
    transition: 150ms;
    &:hover {
        cursor: pointer;
        background-color: ${colors.primary};
        color: ${colors.backgroundWhite};
    } 
`;

function Profile() {
    const [username, setUsername] = useState('');
    const [file, setFile] = useState();
    const [image, setImage] = useState('');
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const passphrase = 'eDgf52LopfXCvs8dsfg456LmsifBs785';
    const encryptedToken = Cookie.get('token');
    const token = useRef('');

    useEffect(() => {
        if (encryptedToken != null) {
            token.current = CryptoJS.AES.decrypt(encryptedToken, passphrase).toString(Utf8);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        let token = Cookie.get('token');
        if (token == null) {
            navigate('/login');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        const putData = new FormData();
        putData.append('userId', userId);
        putData.append('pictureUrl', file);
        putData.append('username', username);
        localStorage.removeItem('pictureUrl');
        localStorage.removeItem('username');
        if (username.length > 25) {
            window.alert("Le nom d'utilisateur ne doit pas dépacer 25 caractères");
        } else {
            axios.put('http://localhost:4200/api/auth/modify', putData, { 
                headers: {"Authorization" : `Bearer ${token.current}`} 
            })
                .then(res => {
                    localStorage.setItem('pictureUrl', res.data.pictureUrl);
                    localStorage.setItem('username', res.data.username);
                    console.log(res);
                    navigate('/home')
                })
                .catch(err => console.log(err))
        }
    }

    return (
        <ProfileBox action='' onSubmit={handleSubmit}>
            <TitleWrapper><StyledTitle>Modifier la photo de profil</StyledTitle><TitleUnderline number='1'></TitleUnderline></TitleWrapper>
            <label htmlFor="files"><BiDownload size={22}/> Importer une image</label>
            <input id="files" type="file" onChange={(e) => {imageHandler(e)}}/>
            { image !== '' && 
                <div className='imageWrapper'>
                    <img src={image} alt="" />
                    <button className='cancelbtn' onClick={() => setImage('')}><AiFillCloseCircle/></button>
                </div>
            }
            <TitleWrapper><StyledTitle>Modifier le nom d'utilisateur</StyledTitle><TitleUnderline number='2'></TitleUnderline></TitleWrapper>
            <StyledInput type="text" placeholder="Nouveau nom d'utilisateur"  value={username} onChange={(e) => setUsername(e.target.value)}/> <br />
            <p>(25 caractères max.)</p>
            <StyledBtn type="submit" value="Enregistrer les modifications"/>
        </ProfileBox>
    );
}

export default Profile;