import React, { useState } from 'react';
import axios from 'axios';
import styled from "styled-components";
import colors from '../../utils/style/colors';
import { BiDotsHorizontalRounded, BiSend } from 'react-icons/bi';
import { AiFillCloseCircle } from 'react-icons/ai';
import Cookie from 'js-cookie';

const Comment = styled.div `
    width: 100%;
    display: flex;
    align-items: flex-start;
    position: relative;
    border-radius: 15px;
    background-color: ${colors.backgroundLight};
    > div {
        display: flex;
        align-items: center;
    }
    .comment_name {
        font-size: 1.1rem;
        font-weight: bold;
        margin: 32px 15px 0 25px; 
    }
    .comment {
        font-size: 1rem;
        margin: 0 50px 0px 15px;
        padding-top: 33px;
        overflow: auto;
        width: 60%;
    }
    .comment_menu.active {
        opacity: 1;
        visibility: visible;
        transform: translateX(0);
        transition: 0.2s ease;
    }
    .comment_menu.inactive {
        opacity: 0;
        visibility: hidden;
        transform: translateX(-20px);
        transition: 0.2s ease;
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

const UpdateCommentForm = styled.form `
    width: 90%;
    display: flex;
    align-items: center;
    margin: 20px 0 0 15px;
    input[type=text] {
        width: 85%;
        height: 50px;
        padding: 15px;
        border: none;
        outline: none;
        border-radius: 15px 0 0 15px;
        color: ${colors.tertiary};
    }
    .sendbtn {
        height: 50px;
        width: 7%;
        padding-top: 4px;
        margin-left: 6px;
        border-radius: 0 13px 13px 0;
        border: 0;
        outline: 0;
        background-color: ${colors.secondary};
        color: ${colors.primary};
        transition: 150ms;
        &:hover {
            background-color: ${colors.primary};
            color: ${colors.backgroundWhite};
            cursor: pointer;
        }
    }
    .cancelbtn {
        position: absolute;
        right: 140px;
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
`;

const OpenMenuBtn = styled.button `
    position: absolute;
    right: 15px;
    top: 25px;
    width: 40px;
    height: 40px;
    background-color: ${colors.backgroundLight};
    border: none;
    padding-top: 4px;
    border-radius: 50%;
    &:hover {
        background-color: #DCDCDC;
        cursor: pointer;
    }
`;

const StyledMenu = styled.div `
    position: absolute;
    right: -120px;
    top: 10px;
    width: 120px;
    height: 80px;
    display: flex;
    background-color: ${colors.backgroundWhite};
    flex-direction: column;
    box-shadow: 1px 1px 200px #DFDFDF;
`;

const MenuBtn = styled.button `
    background-color: ${colors.backgroundWhite};
    height: 40px;
    width: 100%;
    border: none;
    &:hover {
        background-color: ${colors.backgroundLight};
        cursor: pointer;
    }
`;

function Comments(props) {
    const [openMenu, setOpenMenu] = useState(false);
    const [updateOn, setUpdateOn] = useState(false);
    const [comment, setComment] = useState(props.comment);
    const token = Cookie.get('token');
    const userId = localStorage.getItem('userId');

    function deleteComment(data) {
        axios.delete(`http://localhost:4200/api/posts/${data}/comment`,{ 
            headers: {"Authorization" : `Bearer ${token}`} 
        })
            .then(res => {
                console.log(res);
            })
            .catch(err => console.log(err))
    }

    function updateComment(data) {
        const postData = [{
            'userId': userId,
            'comment': comment
        }]
        axios.put(`http://localhost:4200/api/posts/${data}/comment`, postData, { 
            headers: {"Authorization" : `Bearer ${token}`} 
        })
            .then(res => {
                console.log(res);
            })
            .catch(err => console.log(err))
    }

    return(
        <Comment>
            <div>
                <PictureWrapper>
                    <img src={props.pictureUrl} alt="" />
                </PictureWrapper>       
            </div>
            { updateOn ? (
                <UpdateCommentForm action='' onSubmit={() => updateComment(props.id)}>
                    <input type="text" value={comment} onChange={(e) => setComment(e.target.value)}/>
                    <button className='sendbtn' type="submit"><BiSend size={30}/></button>
                    <button className='cancelbtn' onClick={() => setUpdateOn(false)}><AiFillCloseCircle/></button>
                </UpdateCommentForm>
            ) : (
                <>
                <p className='comment_name'>{props.username}</p>
                <p className='comment'>{props.comment}</p>
                </>
            )}
            {/* { openMenu === false && 
                <OpenMenuBtn onClick={() => setOpenMenu(true)}><BiDotsHorizontalRounded size={30}/></OpenMenuBtn>
            }
            { openMenu === true && 
                <>
                <OpenMenuBtn onClick={() => setOpenMenu(false)}><BiDotsHorizontalRounded size={30}/></OpenMenuBtn>
                <StyledMenu>
                    <MenuBtn onClick={() => setUpdateOn(true)}>Modifier</MenuBtn>
                    <MenuBtn onClick={() => deleteComment(props.id)}>Supprimer</MenuBtn>
                </StyledMenu>
                </>
            } */}
            <OpenMenuBtn onClick={() => setOpenMenu(!openMenu)}><BiDotsHorizontalRounded size={25}/></OpenMenuBtn>
            <StyledMenu className={`comment_menu ${openMenu? 'active' : 'inactive'}`}>
                <MenuBtn onClick={() => setUpdateOn(true)} >Modifier</MenuBtn>
                <MenuBtn onClick={() => deleteComment(props.id)}>Supprimer</MenuBtn>
            </StyledMenu>
        </Comment>
    );
}

export default Comments;