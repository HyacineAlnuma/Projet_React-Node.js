import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import colors from '../../utils/style/colors';
import { BiDownload } from 'react-icons/bi';
import Cookie from 'js-cookie';

import Post from '../../components/Post';

const HomeBox = styled.div `
    width: 50%;
    margin: auto;
    display: flex:
    flex-direction: column;
    color: ${colors.tertiary};
`;

const StyledTitle = styled.h2 `
    margin: 50px 0;
    color: ${colors.tertiary};
    font-size: 2rem;
    font-weight: 600;
    position: relative;
    z-index: 1;
`;

const TitleUnderline = styled.div `
    height: 13px;
    width: 223px;
    background-color:${colors.secondary};
    position: absolute;
    top: 194px;
    left: 474px;
    z-index: 0;
`;

const CreatePost = styled.form `
    display: flex;
    align-items: center;
    background-color: ${colors.backgroundWhite};
    min-height: 120px;
    border-radius: 15px;
    position: relative;
`;

const ImageWrapper = styled.div `
    width: 70px;
    height 70px;
    overflow: hidden;
    border-radius: 50px;
    margin: 0 30px;
    position: absolute;
    top: 25px;
    img {
        max-height: 100%;
        width: auto;
    }
`;

const InputWrapper = styled.div `
    display: flex;
    flex-direction: column;
    gap: 10px;
    input[type="text"] {
        height: 50px;
        width: 710px;
        margin: 15px 0 0 140px;
        border: none;
        &:focus {
            outline: none;
        }
    }
    input[type="file"] {
        visibility: hidden;
        position: absolute;
    }
    label {
        width: 200px;
        margin: 5px 0 0 140px;
        color: ${colors.primary};
        font-size: 0.9rem;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap 10px;
    }
    img {
        width: 100px;
        height: auto;
        margin-left: 140px;
    }
`;

const SubmitBtn = styled.input `
    height: 100px;
    width: 80px;
    position: absolute;
    top: 10px;
    right: 10px;
    border-radius: 0 13px 13px 0;
    border: none;
    background-color: ${colors.secondary};
    color: ${colors.primary};
    transition: 150ms;
    &:hover {
        background-color: ${colors.primary};
        color: ${colors.backgroundWhite};
        cursor: pointer;
    }
`;

function Home() {
    const [textpost, setTextpost] = useState('');
    const [file, setFile] = useState();
    const [image, setImage] = useState('');
    const [postsList, setPostsList] = useState([]);
    const profilePic = localStorage.getItem('pictureUrl');
    const navigate = useNavigate();

    const userId = localStorage.getItem('userId');
    const token = Cookie.get('token');

    useEffect(() => {
        let token = Cookie.get('token');
        if (token == null) {
            navigate('/login');
        }
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

    function createPost(e) {
        e.preventDefault();
        const postData = new FormData();
        postData.append('userId', userId);
        postData.append('textpost', textpost);
        postData.append('imageUrl', file);
        axios.post('http://localhost:4200/api/posts', postData, { 
            headers: {"Authorization" : `Bearer ${token}`}
        })
            .then(res => {
                console.log(res);
                window.location.reload(false);
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        axios.get('http://localhost:4200/api/posts',{ 
            headers: {"Authorization" : `Bearer ${token}`} 
        })
            .then(res => {
                setPostsList(res.data.results);
            })
            .catch(err => console.log(err))
    }, [postsList]);

    return(
        <HomeBox>
            <StyledTitle>Fil d'actualité</StyledTitle>
            <TitleUnderline></TitleUnderline>
            <CreatePost action='' onSubmit={createPost}>
                <ImageWrapper>
                    <img src={profilePic} alt="" />
                </ImageWrapper>
                <InputWrapper>
                    <input type="text" placeholder='Écrivez ce qui vous passe par l’esprit...' value={textpost} onChange={(e) => setTextpost(e.target.value)}/>
                    <label htmlFor="files"><BiDownload size={22}/> Importer une image</label>
                    <input id="files" type="file" onChange={(e) => {imageHandler(e)}}/>
                    { image !== '' && <img src={image} alt="" /> }
                </InputWrapper>
                <SubmitBtn type="submit" value="Publier"/>
            </CreatePost>
            {postsList.map(data => (
                <Post key={data.id} {...data}/>
            ))}
        </HomeBox>
    );
}

export default Home;