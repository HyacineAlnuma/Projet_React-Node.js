import React, { useState } from 'react';
import axios from 'axios';
import styled from "styled-components";
import colors from '../../utils/style/colors';
import { BiDotsHorizontalRounded, BiDownload } from 'react-icons/bi';
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
        .name {
        font-size: 1.1rem;
        margin-left: 10px; 
        }
    }
    .comment {
        font-size: 1rem;
        margin: 0 50px 0 15px;
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

const OpenMenuBtn = styled.button `
    position: absolute;
    right: 15px;
    top: 13px;
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
    const [comment, setComment] = useState('');
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
                <p className='name'>{props.username}</p>
            </div>
            { updateOn ? (
                <>
                <form action='' onSubmit={() => updateComment(props.id)}>
                <input type="text" placeholder='Modifiez votre post...' value={comment} onChange={(e) => setComment(e.target.value)}/>
                <label htmlFor="files"><BiDownload size={22}/> Importer une image</label>
                <input type="submit"/>
                
                </form>
                <button onClick={() => setUpdateOn(false)}>Annuler</button>
                </>
            ) : (
                <p className='comment'>{props.comment}</p>
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