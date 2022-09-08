import React, { useState, useEffect, useRef } from 'react';
import { useClickOutside } from '../../utils/hooks/useClickOutside';
import axios from 'axios';
import styled from "styled-components";
import colors from '../../utils/style/colors';
import Cookie from 'js-cookie';
import { BiCommentDetail, BiDotsVerticalRounded, BiDownload } from 'react-icons/bi';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

import CommentSection from '../CommentSection';

const PostBox = styled.div `
    background-color: ${colors.backgroundWhite};
    border-radius: 15px;
    margin-top: 50px;
    padding-bottom: 20px;
    margin-bottom: 50px;
    position: relative;
    a > img {
        width: 200px;
        height: auto;
        margin-left: 20px;
    }
    > div {
        display: flex;
        align-items: center;
        .name {
            width: 50%;
            font-size: 1.1rem;
            font-weight: bold;
            margin-top: 25px;
            overflow-wrap: break-word;
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
    > img {
        width: 200px;
        height: auto;
        margin-top: 50px;
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
    button {
        display: flex;
        align-items: center;
        padding-left: 5px;
        background-color: ${colors.backgroundWhite};
        border: none;
        cursor: pointer;
        transition: 500ms ease;
        color: ${colors.primary};
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
    const [likesList, setLikesList] = useState([]);
    const menuRef = useRef();
    const [openMenu, toggle] = useClickOutside(menuRef);
    
    const token = Cookie.get('token');
    const userRole = Cookie.get('userRole');
    const userId = +localStorage.getItem('userId');

    useEffect(() => {
        axios.get(`http://localhost:4200/api/posts/${props.id}/likes`,{ 
            headers: {"Authorization" : `Bearer ${token}`} 
        })
            .then(res => {
                setLikesList(res.data.result);
            })
            .catch(err => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [likesList]);

    let likedPost = false;
    for(let i = 0; i < likesList.length; i++) {
        if (likesList[i].userId === userId) {
            likedPost = true;
            break;
        }
    }

    function updatePost(data) {
        const postData = new FormData();
        postData.append('userId', userId);
        postData.append('textpost', textpost);
        postData.append('imageUrl', file);
        postData.append('userRole', userRole);
        axios.put(`http://localhost:4200/api/posts/${data}`, postData, { 
            headers: {"Authorization" : `Bearer ${token}`} 
        })
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
                window.alert(JSON.stringify(err.response.data.message));
            })
    }

    function imageHandle(e) {
        let files = Array.from(e.target.files);
        setFile(files[0]);
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = () => {
            setImage(reader.result?.toString() ?? '');
        };
    }

    function deletePost(data) {
        axios.delete(`http://localhost:4200/api/posts/${data}`, { 
            headers: {"Authorization" : `Bearer ${token}`},
            data: {userRole: userRole} 
        })
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
                window.alert(JSON.stringify(err.response.data.message));
            })
    }

    function likePost(props) {
        let likeData = [{
            'userId': userId
        }];
        axios.post(`http://localhost:4200/api/posts/${props}/like`, likeData, { 
            headers: {"Authorization" : `Bearer ${token}`},
        })
            .then(res => {
                console.log(res);
            })
            .catch(err => console.log(err))
    }

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
                <a href={props.imageUrl}><img src={props.imageUrl} alt="" /></a>
                </>
            )}
            <IconsWrapper>
                {likedPost ? (
                    <button state={likedPost} onClick={() => likePost(props.id)}><AiFillHeart size={24}/><p>{likesList.length}</p></button>
                ) : (
                    <button state={likedPost} onClick={() => likePost(props.id)}><AiOutlineHeart size={24}/><p>{likesList.length}</p></button>
                )}
                <BiCommentDetail size={24}/><p>{props.commentsNumber}</p>
            </IconsWrapper>
            <CommentSeparation></CommentSeparation>
            <CommentSection id={props.id}/>
        </PostBox>
    );
}

export default Post;