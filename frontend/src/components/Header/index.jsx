import { useRef } from 'react';
import logo from '../../assets/icon-left-font.png';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import colors from '../../utils/style/colors';
import Cookie from 'js-cookie';
import { FiMenu } from "react-icons/fi";
import { CgClose } from "react-icons/cg";
import { useClickOutside } from '../../utils/hooks/useClickOutside';

const HeaderStyle = styled.header`
    display: flex;
    position: relative;
    align-items: center;
    justify-content: space-between;
    height: 122px;
    background-color: ${colors.backgroundWhite};
`;

const ImageStyle = styled.img`
    width: auto;
    height: 100px;
    margin: 10px 0 0 60px;
    @media all and (max-width: 860px) {
        width: 230px;
        height: auto;
        margin-left: 5px;
    }
`;

const StyledNav = styled.nav`
    margin: 50px 0px;
    .menu.active {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
        transition: 0.2s ease;
    }
    .menu.inactive {
        opacity: 0;
        visibility: hidden;
        transform: translateY(-40px);
        transition: 0.2s ease;
    }
    @media all and (max-width: 1011px) {
        display: flex;
        flex-direction: column;
    }
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
    @media all and (max-width: 640px) {
        width: 120px;
        padding: 10px;
        text-align: center;
        margin: 0 20px 0 0;
        font-size: 0.7rem;
    }
`;

const StyledMenu = styled.div `
    width: 210px;
    display: flex;
    flex-direction: column;
    position: absolute;
    z-index: 3;
    right: 60px;
    top: 38px;
    background-color: ${colors.backgroundWhite};
    box-shadow: 1px 1px 200px #DFDFDF;
    border-radius: 15px 0 15px 15px;
    @media all and (max-width: 680px) {
        right: 20px;
        top: 67px;
    }
`;

const MenuBtn = styled(Link) `
    font-size: 1.1rem;
    color: ${colors.tertiary};
    padding: 20px;
    ${(props)=> props.to === '/login' &&
        `border-radius: 0 0 15px 15px;`
    };
    ${(props)=> props.to === '/profile' &&
        `border-radius: 0;
        padding-top: 50px;
        @media all and (max-width: 680px) {
            border-radius: 15px 0 0 0;
            padding-top: 25px;
        }`
    };
    transition: 100ms;
    &:hover {
        color: ${colors.primary};
        background-color: ${colors.secondary};
        cursor: pointer;
    }
`;

const OpenMenuBtn = styled.button `
    max-width: 400px;
    min-width: 210px;
    position: absolute;
    right: 60px;
    display: flex;
    align-items: center;
    border: none;
    outline: none;
    background-color: ${colors.secondary};
    border-radius: 30px 30px 0 30px; 
    color: ${colors.primary};
    position: relative;
    z-index: 10;
    p {
        color: ${colors.primary};
        margin: 15px;
        font-family: 'Roboto', sans-serif;
        font-size: 1.1rem;
    }
    &:hover {
        background-color: ${colors.primary};
        color: ${colors.backgroundWhite};
        p {
            color: ${colors.backgroundWhite};
        }
        cursor: pointer;
    }
    ${(props) => props.state === true &&
        `background-color: ${colors.primary};
        color: ${colors.backgroundWhite};
        p {
            color: ${colors.backgroundWhite};
        }`
    };
    @media all and (max-width: 680px) {
        right: 20px;
        max-width: 200px;
        min-width: 0;
        p {
            width: 0px;
            overflow: hidden;
            margin: 0;
        }
    }
`;

const ImageWrapper = styled.div `
    width: 40px;
    height 40px;
    overflow: hidden;
    margin: 0 15px;
    img {
        max-height: 100%;
        border-radius: 50%;
        width: auto;
        object-fit: cover;
    }
`;

const IconWrapper = styled.div `
    margin: 18px 15px 15px 15px;
   
`;

const HomeMenu = styled.div `
    position: relative;
    margin: 0;
`;

function Header() {
    const location = useLocation();
    const menuRef = useRef();
    const [openMenu, toggle] = useClickOutside(menuRef);

    const profilePic = localStorage.getItem('pictureUrl');
    const username = localStorage.getItem('username');
    let token = Cookie.get('token');


    function Logout() {
        Cookie.remove('token');
        Cookie.remove('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('pictureUrl');
    }

    return(
        <HeaderStyle>
            <Link to='/home'><ImageStyle src= {logo} alt='Logo Groupomania'></ImageStyle></Link>
            <StyledNav>
                { token ? (
                    <HomeMenu ref={menuRef}>
                        <OpenMenuBtn onClick={() => toggle()} state={openMenu}>
                            <ImageWrapper>
                                    <img src={profilePic} alt="" />
                            </ImageWrapper>
                            <p>{username}</p>
                            <IconWrapper>
                                {openMenu ? <CgClose size={30}/> : <FiMenu size={30}/>}
                            </IconWrapper>                 
                        </OpenMenuBtn>
                        <StyledMenu className={`menu ${openMenu? 'active' : 'inactive'}`}>
                            <MenuBtn to='/profile'>Modifier le profil</MenuBtn>
                            <MenuBtn to="/login" onClick={Logout}>
                                Se déconnecter
                            </MenuBtn>
                        </StyledMenu>
                    </HomeMenu>
                ) : (
                    <>
                    <StyledLink to="/signup" page={location.pathname}>
                        Créer un compte
                    </StyledLink>
                    <StyledLink to="/login" page={location.pathname}>
                        Se connecter
                    </StyledLink>
                    </>
                )}
            </StyledNav>
        </HeaderStyle>
    );
}

export default Header;