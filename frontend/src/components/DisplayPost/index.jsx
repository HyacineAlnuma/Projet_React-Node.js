import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from "styled-components";
import colors from '../../utils/style/colors';
import Cookie from 'js-cookie';
import { BiHeart,BiCommentDetail, BiSend, BiDotsVerticalRounded, BiDownload } from 'react-icons/bi';

import Comments from '../DisplayComments';

const Post = styled.div `
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
    }
    p {
        margin: 20px;
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

function DisplayPost(props) {
    const [openMenu, setOpenMenu] = useState(false);
    const token = Cookie.get('token');
    const userId = localStorage.getItem('userId');
    // const [postsList, setPostsList] = useState([]);
    // console.log(props.id.username);
    

    function updatePost() {

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
        const likeData = new FormData();
        likeData.append('userId', userId);
        axios.post(`http://localhost:4200/api/posts/${props}/like`, likeData, { 
            headers: {"Authorization" : `Bearer ${token}`}
        })
            .then(res => {
                console.log(res);
            })
            .catch(err => console.log(err))
    }

    // useEffect(() => {
    //     axios.get('http://localhost:4200/api/posts')
    //     .then(res => {
    //         setPostsList(res.data.results);
    //     })
    //     .catch(err => console.log(err))
    // }, [postsList.length < 1]);

    return (
        // <div>
        //     {postsList.map(data => (
                <Post>
                    <div>
                        <PictureWrapper>
                            <img src={props.id.pictureUrl} alt="" />
                        </PictureWrapper>
                        <p className='name'>{props.id.username}</p>
                        {/* { openMenu ? (
                            <button onClick={() => setOpenMenu(true)}><BiDotsVerticalRounded size={30}/></button>
                        ) : (
                            <>
                            <button onClick={() => setOpenMenu(false)}><BiDotsVerticalRounded size={30}/></button>
                            <StyledMenu>
                                <MenuBtn onClick={updatePost} >Modifier</MenuBtn>
                                <MenuBtn onClick={deletePost}>Supprimer</MenuBtn>
                            </StyledMenu>
                            </>
                        )} */}
                        { openMenu === false && 
                            <OpenMenuBtn onClick={() => setOpenMenu(true)}><BiDotsVerticalRounded size={30}/></OpenMenuBtn>
                        }
                        { openMenu === true && 
                            <>
                            <OpenMenuBtn onClick={() => setOpenMenu(false)}><BiDotsVerticalRounded size={30}/></OpenMenuBtn>
                            <StyledMenu>
                                <MenuBtn onClick={updatePost} >Modifier</MenuBtn>
                                <MenuBtn onClick={() => deletePost(props.id.id)}>Supprimer</MenuBtn>
                            </StyledMenu>
                            </>
                        }
                    </div>
                    <p>{props.id.textpost}</p>
                    <img src={props.id.imageUrl} alt="" />
                    <IconsWrapper>
                        <button onClick={() => likePost(props.id.id)}><BiHeart size={24}/><p>{props.id.likes}</p></button>
                        <BiCommentDetail size={24}/><p>{props.id.commentsNumber}</p>
                    </IconsWrapper>
                    <CommentSeparation></CommentSeparation>
                    <Comments id={props.id.id}/>
                </Post>
            // ))}
    //     </div>
    );
}

export default DisplayPost;