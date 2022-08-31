import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from "styled-components";
import colors from '../../utils/style/colors';
import Cookie from 'js-cookie';
import { BiSend, BiDotsHorizontalRounded } from 'react-icons/bi';

import Comments from '../Comments';

const CommentsSection = styled.div `
    width: 95%;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    border-radius: 15px;
    background-color: ${colors.backgroundLight};
`;

const AddComment = styled.form `
    display: flex;
    width: 100%;
    align-items: center;
    input[type=text] {
        width: 83%;
        height: 50px;
        padding: 0 10px 0 10px;
        outline: 0;
        margin: 6px 0 0 5px;
        border-radius: 15px 0 0 15px;
        border: 4px solid ${colors.backgroundLight};
    }
    button {
        height: 42px;
        width: 7%;
        padding-top: 4px;
        margin-top: 6px;
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

function CommentSection(props) {
    const userId = localStorage.getItem('userId');
    const profilePic = localStorage.getItem('pictureUrl');
    const token = Cookie.get('token');

    const [comment, setComment] = useState('');
    const [commentsList, setCommentsList] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:4200/api/posts/${props.id}/comment`, { 
            headers: {"Authorization" : `Bearer ${token}`}
        })
            .then(res => {
                setCommentsList(res.data.result);
            })
            .catch(err => console.log(err))
    }, [commentsList]);

    function addComment(e) {
        e.preventDefault();
        let commentData = [{
            'userId': userId,
            'postId': props.id,
            'comment': comment
        }];
        axios.post(`http://localhost:4200/api/posts/${props.id}/comment`, commentData, { 
            headers: {"Authorization" : `Bearer ${token}`}
        })
            .then(res => {
                console.log(res);
            })
            .catch(err => console.log(err))
    }

    return (
        <div>
            <CommentsSection>
                {commentsList.map(data => (
                    // <>
                    // { props.id = data.postId &&
                    <Comments key={data.id} {...data}/>
                    //     {/* <div>
                    //         <PictureWrapper>
                    //             <img src={data.pictureUrl} alt="" />
                    //         </PictureWrapper>
                    //         <p className='name'>{data.username}</p>
                    //     </div>
                    //     <p className='comment'>{data.comment}</p>
                    //     { openMenu === false && 
                    //         <OpenMenuBtn onClick={() => setOpenMenu(true)}><BiDotsHorizontalRounded size={30}/></OpenMenuBtn>
                    //     }
                    //     { openMenu === true && 
                    //         <>
                    //         <OpenMenuBtn onClick={() => setOpenMenu(false)}><BiDotsHorizontalRounded size={30}/></OpenMenuBtn>
                    //         <StyledMenu>
                    //             <MenuBtn >Modifier</MenuBtn>
                    //             <MenuBtn >Supprimer</MenuBtn>
                    //         </StyledMenu>
                    //         </>
                    //     }
                    // </Comment> */}
                    // {/* // }
                    // // </> */}
                ))}
                <AddComment action='' onSubmit={(e) => addComment(e)}>
                    <PictureWrapper>
                        <img src={profilePic} alt="" />
                    </PictureWrapper>
                    <input type="text" placeholder='Écrivez un commentaire...' value={comment} onChange={(e) => setComment(e.target.value)}/>
                    <button type="submit"><BiSend size={30}/></button>
                </AddComment>
            </CommentsSection>
        </div>
    );
}

export default CommentSection;
