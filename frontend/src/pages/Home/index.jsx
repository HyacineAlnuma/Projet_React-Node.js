import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import colors from '../../utils/style/colors';
import Cookie from 'js-cookie';
import CryptoJS from 'crypto-js';
import Utf8 from 'crypto-js/enc-utf8';

import Post from '../../components/Post';
import CreatePost from '../../components/CreatePost';

const HomeBox = styled.div `
    width: 50%;
    margin: auto;
    display: flex:
    flex-direction: column;
    color: ${colors.tertiary};
    @media all and (max-width: 1275px) {
        width: 80%;
    }
    @media all and (max-width: 680px) {
        width: 100%;
    }
`;

const StyledTitle = styled.h2 `
    margin: 50px 0;
    color: ${colors.tertiary};
    font-size: 2.1rem;
    font-weight: 600;
    position: relative;
    z-index: 1;
`;

const TitleUnderline = styled.div `
    height: 13px;
    width: 223px;
    background-color:${colors.secondary};
    position: absolute;
    top: 197px;
    left: 24.8%;
    z-index: 0;
    @media all and (max-width: 1275px) {
        left: 9.8%;
    }
    @media all and (max-width: 680px) {
        left: 0;
    }
`;

function Home() {
    const [postsList, setPostsList] = useState([]);
    const navigate = useNavigate();

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
        // let token = Cookie.get('token');
        if (encryptedToken == null) {
            navigate('/login');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        axios.get('http://localhost:4200/api/posts',{ 
            headers: {"Authorization" : `Bearer ${token.current}`} 
        })
            .then(res => {
                setPostsList(res.data.results);
            })
            .catch(err => console.log(err))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postsList]);

    return(
        <HomeBox>
            <StyledTitle>Fil d'actualité</StyledTitle>
            <TitleUnderline></TitleUnderline>
            <CreatePost/>
            {postsList.map(data => (
                <Post key={data.id} {...data}/>
            ))}
        </HomeBox>
    );
}

export default Home;