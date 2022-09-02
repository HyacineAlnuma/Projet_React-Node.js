import React, { useState, useEffect, useRef } from 'react';
import { useClickOutside } from '../../utils/hooks/useClickOutside';
import axios from 'axios';
import styled from "styled-components";
import colors from '../../utils/style/colors';
import Cookie from 'js-cookie';
import { BiHeart, BiCommentDetail, BiDotsVerticalRounded, BiDownload } from 'react-icons/bi';

import CommentSection from '../CommentSection';

const PostBox = styled.div `
    background-color: ${colors.backgroundWhite};
    border-radius: 15px;
    margin-top: 50px;
    padding-bottom: 20px;
    margin-bottom: 50px;
    position: relative;
    > img {
        width: 200px;
        height: auto;
        margin-left: 20px;
    }
    > div {
        display: flex;
        align-items: center;
        .name {
            font-size: 1.1rem;
            font-weight: bold;
            margin-top: 25px;
        }
        .menu.active {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
            transition: 0.2s ease;
        }
        .menu.inactive {
            opacity: 0;
            visibility: hidden;
            transform: translateY(-20px);
            transition: 0.2s ease;
        }
    }
    p {
        margin: 20px;
    }
    .textpost {
        margin-left: 30px;
    }
`;

const PictureWrapper = styled.div `
    width: 50px;
    height 50px;
    overflow: hidden;
    border-radius: 50px;
    margin: 20px 0 10px 20px;
    img {
        max-height: 100%;
        width: auto;
    }
`;

const OpenMenuBtn = styled.button `
    position: absolute;
    top: 30px;
    right: 30px;
    width: 40px;
    background-color: ${colors.backgroundWhite};
    border: none;
    padding-top: 4px;
    border-radius: 50%;
    &:hover {
        background-color: ${colors.backgroundLight};
        cursor: pointer;
    }
`;

const StyledMenu = styled.div `
    width: 120px;
    height: 80px;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 70px;
    right: 30px;
    box-shadow: 1px 1px 200px #DFDFDF;
    z-index: 10;
`;

const MenuBtn = styled.button `
    background-color: ${colors.backgroundWhite};
    height: 40px;
    border: none;
    &:hover {
        background-color: ${colors.backgroundLight};
        cursor: pointer;
    }
`;

const UpdatePostForm = styled.form `
    margin: 30px 0 40px 40px;
    position: relative;
    textarea {
        width: 94%;
        margin-bottom: 20px;
        padding: 20px;
        border-radius: 20px;
        resize: none;
        border: none;
        outline: none;
        background-color: ${colors.backgroundLight};
        color: ${colors.tertiary};
        z-index: 0;
    }
    input[type="file"] {
        visibility: hidden;
    }
    label {
        width: 200px;
        margin: 5px 0;
        color: ${colors.primary};
        font-size: 0.9rem;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap 10px;
    }
    input[type=submit] {
        position: absolute;
        left: 0px; 
        top 225px;
        width: 140px;
        height: 40px;
        border-radius: 20px;
        background-color: ${colors.secondary};
        color: ${colors.primary};
        border: none;
        transition: 150ms;
        &:hover {
            background-color: ${colors.primary};
            color: ${colors.backgroundWhite};
            cursor: pointer;
        }
    }
    button {
        position: absolute;
        left: 150px; 
        top 235px;
        margin-left: 10px;
        color: ${colors.primary};
        background-color: ${colors.backgroundWhite};
        border: none;
        &:hover {
            text-decoration: underline;
            cursor: pointer;
        }
    }
`;

const IconsWrapper = styled.div `
    margin-left: 20px;
    display: flex;
    align-items: center;
    color: ${colors.primary};
    p {
        margin: 20px 20px 20px 5px !important;
        color: ${colors.tertiary};
    }
    > button {
        display: flex;
        align-items: center;
        padding-left: 5px;
        background-color: ${colors.backgroundWhite};
        color: ${colors.primary};
        border: none;
        cursor: pointer;
    }
`;

const CommentSeparation = styled.div `
    width: 90%;
    margin: 0 auto 20px;
    height: 1px;
    background-color: #F0F0F0;
`;


function Post(props) {
    const [updateOn, setUpdateOn] = useState(false);
    const [file, setFile] = useState();
    const [image, setImage] = useState(props.imageUrl);
    const [textpost, setTextpost] = useState(props.textpost);
    const token = Cookie.get('token');
    const userId = localStorage.getItem('userId');
    const menuRef = useRef();
    

    function updatePost(data) {
        const postData = new FormData();
        postData.append('userId', userId);
        postData.append('textpost', textpost);
        postData.append('imageUrl', file);
        axios.put(`http://localhost:4200/api/posts/${data}`, postData, { 
            headers: {"Authorization" : `Bearer ${token}`} 
        })
            .then(res => {
                console.log(res);
            })
            .catch(err => console.log(err))
    }

    function imageHandle(e) {
        let files = Array.from(e.target.files);
        console.log(files);
        setFile(files[0]);
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = () => {
            setImage(reader.result?.toString() ?? '');
        };
    }

    function deletePost(data) {
        axios.delete(`http://localhost:4200/api/posts/${data}`,{ 
            headers: {"Authorization" : `Bearer ${token}`} 
        })
            .then(res => {
                console.log(res);
            })
            .catch(err => console.log(err))
    }

    function likePost(props) {
        let likeData = [{
            'userId': userId
        }];
        axios.post(`http://localhost:4200/api/posts/${props}/like`, likeData, { 
            headers: {"Authorization" : `Bearer ${token}`}
        })
            .then(res => {
                console.log(res);
            })
            .catch(err => console.log(err))
    }

    // useEffect(() => {
    //     let handler = (e) => {
    //         if (!menuRef.current.contains(e.target)) {
    //             setOpenMenu(false);
    //         }
    //     };
    //     document.addEventListener("click", handler);

    //     return () => {
    //         document.removeEventListener("click", handler);
    //     }
    // })
    const [openMenu, toggle] = useClickOutside(menuRef);

    return (
        <PostBox>
            <div>
                <PictureWrapper>
                    <img src={props.pictureUrl} alt="" />
                </PictureWrapper>
                <p className='name'>{props.username}</p>
                <div ref={menuRef}>
                    <OpenMenuBtn  onClick={() => toggle()}><BiDotsVerticalRounded size={30}/></OpenMenuBtn>
                    <StyledMenu className={`menu ${openMenu? 'active' : 'inactive'}`}>
                        <MenuBtn onClick={() => setUpdateOn(true)} >Modifier</MenuBtn>
                        <MenuBtn onClick={() => deletePost(props.id)}>Supprimer</MenuBtn>
                    </StyledMenu>
                </div>
            </div>
            { updateOn ? (
                <UpdatePostForm action='' onSubmit={() => updatePost(props.id)}>
                    <textarea type="text" rows='5' onChange={(e) => setTextpost(e.target.value)}>{props.textpost}</textarea>
                    <label htmlFor="file"><BiDownload size={22}/> Importer une image</label>
                    <input id="file" type="file" onChange={(e) => {imageHandle(e)}}/>
                    { image !== '' && <img src={image} alt="" /> }
                    <input type="submit" value='Mettre à jour'/>
                    <button onClick={() => setUpdateOn(false)}>Annuler</button>
                </UpdatePostForm>
            ) : (
                <>
                <p className='textpost'>{props.textpost}</p>
                <img src={props.imageUrl} alt="" />
                </>
            )}
            <IconsWrapper>
                <button onClick={() => likePost(props.id)}><BiHeart size={24}/><p>{props.likes}</p></button>
                <BiCommentDetail size={24}/><p>{props.commentsNumber}</p>
            </IconsWrapper>
            <CommentSeparation></CommentSeparation>
            <CommentSection id={props.id}/>
        </PostBox>
    );
}

export default Post;