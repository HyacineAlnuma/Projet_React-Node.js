import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import colors from '../../utils/style/colors';

const HomeBox = styled.div `
    width: 50%;
    margin: auto;
    display: flex:
    flex-direction: column;
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
    width: 229px;
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
    height: 120px;
    border-radius: 15px;
    position: relative;
`;

const ImageWrapper = styled.div `
    width: 70px;
    height 70px;
    overflow: hidden;
    border-radius: 50px;
    margin: 0 30px;
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
        margin-top: 15px;
        border: none;
        &:focus {
            outline: none;
        }
    }
    input[type="file"] {
        margin-top: 5px;
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
    const profilePic = localStorage.getItem('pictureUrl');

    const userId = localStorage.getItem('userId');

    function imageHandler(e) {
        let files = Array.from(e.target.files);
        console.log(files);
        setFile(files[0]);
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
    }

    function handleSubmit(e) {
        e.preventDefault();
        const postData = new FormData();
        postData.append('userId', userId);
        postData.append('textpost', textpost);
        postData.append('imageUrl', file);
        console.log(postData);
        axios.post('http://localhost:4200/api/posts', postData)
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }

    return(
        <HomeBox>
            <StyledTitle>Fil d'actualité</StyledTitle>
            <TitleUnderline></TitleUnderline>
            <CreatePost action='' onSubmit={handleSubmit}>
                <ImageWrapper>
                    <img src={profilePic} alt="" />
                </ImageWrapper>
                <InputWrapper>
                    <input type="text" placeholder='Écrivez ce qui vous passe par l’esprit...' value={textpost} onChange={(e) => setTextpost(e.target.value)}/>
                    <input id="files" type="file" onChange={(e) => {imageHandler(e)}}/>
                </InputWrapper>
                <SubmitBtn type="submit" value="Publier"/>
            </CreatePost>
        </HomeBox>
    );
}

export default Home;