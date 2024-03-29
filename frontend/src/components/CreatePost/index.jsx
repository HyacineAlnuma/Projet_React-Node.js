import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import colors from '../../utils/style/colors';
import { BiDownload } from 'react-icons/bi';
import { AiFillCloseCircle } from 'react-icons/ai';
import Cookie from 'js-cookie';
import { useImageHandler } from '../../utils/hooks/useImageHandler';

const NewPost = styled.form `
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
    @media all and (max-width: 680px) {
        width: 0;
        overflow: hidden;
    }
`;

const InputWrapper = styled.div `
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;
    textarea {
        height: 50px;
        max-width: 72%;
        margin: 15px 100px 0 140px;
        border: none;
        resize: none;
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
    > div {
        display: flex;
    }
    .cancelbtn {
        background-color: ${colors.backgroundWhite};
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
        label {
            position: absolute;
            left: -120px;
            bottom: -30px;
            p {
                font-size: 0.9rem;
            }
        }
        textarea {
            margin: 0 0 0 15px;
        }
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
    @media all and (max-width: 680px) {
        width: 50px;
        font-size: 0.9rem;
    }
`;

function CreatePost() {
    const [textpost, setTextpost] = useState('');
    const {file, image,  setFile, setImage, imageHandler } = useImageHandler();
    const profilePic = localStorage.getItem('pictureUrl');

    const userId = localStorage.getItem('userId');
    const token = Cookie.get('token');

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
                setTextpost('');
                setImage('');
                setFile();
            })
            .catch(err => console.log(err))
    }

    return(
        <NewPost action='' onSubmit={createPost}>
            <ImageWrapper>
                <img src={profilePic} alt="" />
            </ImageWrapper>
            <InputWrapper>
                <textarea type='text' placeholder='Écrivez ce qui vous passe par l’esprit...' value={textpost} onChange={(e) => setTextpost(e.target.value)}></textarea>
                <label htmlFor="files"><BiDownload size={22}/><p>Importer une image</p></label>
                <input id="files" type="file" onChange={(e) => {imageHandler(e)}}/>
                { image !== '' && 
                    <div>
                        <img src={image} alt="" />
                        <button className='cancelbtn' onClick={() => setImage('')}><AiFillCloseCircle/></button>
                    </div>
                }
            </InputWrapper>
            <SubmitBtn type="submit" value="Publier"/>
        </NewPost>
    );
};

export default CreatePost;