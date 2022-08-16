import { useState } from 'react';
import logo from '../../assets/icon-left-font.png';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import colors from '../../utils/style/colors';
import Cookie from 'js-cookie';
import { FiMenu } from "react-icons/fi";
import { CgClose } from "react-icons/cg";

const HeaderStyle = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 122px;
    background-color: ${colors.backgroundWhite};
`;

const ImageStyle = styled.img`
    width: auto;
    height: 100px;
    margin: 10px 60px;
`;

const StyledNav = styled.nav`
    margin: 50px 90px;
`;

const StyledLink = styled(Link)`
    margin-right: 50px;
    font-size: 1.1rem;
    padding: 13px 35px;
    border-radius: 30px; 
    &:hover, &:active {
        background-color: ${colors.primary};
        color: ${colors.backgroundWhite};
    };
    ${(props)=> props.page === '/login' && 
        `background-color: ${props.to === '/login' ? colors.secondary : colors.backgroundWhite};
        color : ${props.to === '/login' ? colors.primary : colors.tertiary};`
    };
    ${(props)=> props.page === '/signup' && 
        `background-color: ${props.to === '/signup' ? colors.secondary : colors.backgroundWhite};
        color : ${props.to === '/signup' ? colors.primary : colors.tertiary};`
    }
`;

const StyledMenu = styled.div `
    width: 210px;
    display: flex;
    flex-direction: column;
    position: absolute;
    z-index: 5;
    right: 90px;
    top: 67px;
    background-color: ${colors.backgroundWhite};
    box-shadow: 1px 1px 200px #DFDFDF;
    border-radius: 15px;
`;

const MenuBtn = styled(Link) `
    font-size: 1.1rem;
    padding: 20px;
    ${(props)=> props.to === '/login' &&
        `border-radius: 0 0 15px 15px;`
    };
    ${(props)=> props.to === '/profile' &&
        `border-radius: 0;
        padding-top: 50px;`
    };
    transition: 100ms;
    &:hover {
        color: ${colors.primary};
        background-color: ${colors.secondary};
        cursor: pointer;
    }
`;

const OpenMenuBtn = styled.button `
    width: 210px;
    display: flex;
    align-items: center;
    border: none;
    outline: none;
    background-color: ${colors.secondary};
    border-radius: 30px; 
    p {
        color: ${colors.primary};
        margin: 15px;
        font-family: 'Roboto', sans-serif;
        font-size: 1.1rem;
    }
    &:hover {
        background-color: ${colors.primary};
        p {
            color: ${colors.backgroundWhite};
        }
        cursor: pointer;
    }
    ${(props) => props.state === true &&
        `background-color: ${colors.primary};
        p {
            color: ${colors.backgroundWhite};
        }`
    };
    position: relative;
    z-index: 10;
`;

const ImageWrapper = styled.div `
    width: 40px;
    height 40px;
    overflow: hidden;
    border-radius: 50px;
    margin: 0 15px;
    img {
        max-height: 100%;
        width: auto;
    }
`;

const IconWrapper = styled.div `
    margin: 18px 15px 15px 15px;
`;

function Header({ auth, setAuth }) {
    const location = useLocation();
    const [openMenu, setOpenMenu] = useState(false);
    const profilePic = localStorage.getItem('pictureUrl');
    const username = localStorage.getItem('username');
    let iconStyle = { color: "white" };

    function Logout() {
        Cookie.remove('token');
        setAuth(false);
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('pictureUrl');
    }

    return(
        <HeaderStyle>
            <ImageStyle src= {logo} alt='Logo Groupomania'></ImageStyle>
            <StyledNav>
                { location.pathname !== '/home' &&
                    <>
                    <StyledLink to="/signup" page={location.pathname}>
                        Créer un compte
                    </StyledLink>
                    <StyledLink to="/login" page={location.pathname}>
                        Se connecter
                    </StyledLink>
                    </>
                }   
                { location.pathname === '/home'  &&
                    openMenu ? (
                        <>
                        <OpenMenuBtn onClick={() => setOpenMenu(false)} state={openMenu}>
                            <ImageWrapper>
                                    <img src={profilePic} alt="" />
                            </ImageWrapper>
                            <p>{username}</p>
                            <IconWrapper>
                                <CgClose size={30} style={iconStyle}/>
                            </IconWrapper>                 
                        </OpenMenuBtn>
                        <StyledMenu>
                            <MenuBtn to='/profile'>Modifier le profil</MenuBtn>
                            <MenuBtn to="/login" onClick={Logout}>
                                Se déconnecter
                            </MenuBtn>
                        </StyledMenu>
                        </>
                    ) : (
                        <OpenMenuBtn onClick={() => setOpenMenu(true)} state={openMenu}>
                            <ImageWrapper>
                                <img src={profilePic} alt="" />
                            </ImageWrapper>
                            <p>{username}</p>
                            <IconWrapper>
                                <FiMenu size={30} style={iconStyle}/>     
                            </IconWrapper>                 
                        </OpenMenuBtn>
                    )
                }
            </StyledNav>
        </HeaderStyle>
    );
}

export default Header;