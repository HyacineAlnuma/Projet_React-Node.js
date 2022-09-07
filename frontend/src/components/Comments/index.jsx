import React, { useState, useRef } from 'react';
import axios from 'axios';
import styled from "styled-components";
import colors from '../../utils/style/colors';
import { BiDotsHorizontalRounded, BiSend } from 'react-icons/bi';
import { AiFillCloseCircle } from 'react-icons/ai';
import Cookie from 'js-cookie';
import { useClickOutside } from '../../utils/hooks/useClickOutside';

const Comment = styled.div `
    width: 100%;
    display: flex;
    align-items: flex-start;
    position: relative;
    border-radius: 15px;
    background-color: ${colors.backgroundLight};
    > .comment {
        display: flex;
        flex-direction: column;
        width: 70%;
        align-items: flex-start;
        width: 100%;
    }
    .comment_name {
        width: 83%;
        margin: 30px 0 10px 10px;
        overflow-wrap: break-word;    
        font-size: 1.1rem;
        font-weight: bold;
        
    }
    .comment_text {
        margin: 0 0 0 10px;
        padding: 0 25px 0 0;
        width: 100%;
        font-size: 1rem;
        overflow: auto;
        
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
    @media all and (max-width: 680px) {
        width: 50px;
    }
`;

const UpdateCommentForm = styled.form `
    width: 90%;
    display: flex;
    align-items: center;
    margin: 20px 0 0 15px;
    padding-right: 20px;
    input[type=text] {
        width: 85%;
        height: 50px;
        padding: 15px 50px 15px 15px;
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
        right: 17%;
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
    @media all and (max-width: 850px) {
        input[type=text] {
            width: 80%;
        }
        .sendbtn {
            width: 9%;
        }
        .cancelbtn {
            right: 21%;
        }
    }
    @media all and (max-width: 500px) {
        input[type=text] {
            width: 70%;
            padding-right: 20px;
        }
        .sendbtn {
            width: 13%;
        }
        .cancelbtn {
            right: 27%;
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
    z-index: 10;
    width: 120px;
    height: 80px;
    display: flex;
    background-color: ${colors.backgroundWhite};
    flex-direction: column;
    box-shadow: 1px 1px 200px #DFDFDF;
    @media all and (max-width: 680px) {
        right: 15px;
        top: 65px;
    }
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
    const [updateOn, setUpdateOn] = useState(false);
    const [comment, setComment] = useState(props.comment);
    const menuRef = useRef();
    const [openMenu, toggle] = useClickOutside(menuRef);

    const token = Cookie.get('token');
    const userRole = Cookie.get('userRole');
    const userId = localStorage.getItem('userId');

    function deleteComment(data) {
        axios.delete(`http://localhost:4200/api/posts/${data}/comment`,{ 
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

    function updateComment(data) {
        const postData = [{
            'userId': userId,
            'comment': comment,
            'userRole': userRole
        }]
        axios.put(`http://localhost:4200/api/posts/${data}/comment`, postData, { 
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
                <div className='comment'>
                    <p className='comment_name'>{props.username}</p>
                    <p className='comment_text'>{props.comment}</p>
                </div>
            )}
            <div ref={menuRef}>
                <OpenMenuBtn onClick={() => toggle()}><BiDotsHorizontalRounded size={25}/></OpenMenuBtn>
                <StyledMenu className={`comment_menu ${openMenu? 'active' : 'inactive'}`}>
                    <MenuBtn onClick={() => setUpdateOn(true)} >Modifier</MenuBtn>
                    <MenuBtn onClick={() => deleteComment(props.id)}>Supprimer</MenuBtn>
                </StyledMenu>
            </div>
        </Comment>
    );
}

export default Comments;