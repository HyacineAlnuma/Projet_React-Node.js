import logo from '../../assets/icon-left-font.png';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import colors from '../../utils/style/colors'

const HeaderStyle = styled.div`
    display: flex;
    justify-content: space-between;
    background-color: ${colors.backgroundWhite};
`;

const ImageStyle = styled.img`
    width: auto;
    height: 100px;
    margin: 10px 60px;
`;

const StyledNav = styled.nav`
    margin: 50px;
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

// const ActiveStyledLink = styled(Link)`
//     margin-right: 50px;
//     font-size: 1.1rem;
//     padding: 13px 35px;
//     border-radius: 30px; 
//     background-color: ${colors.secondary};
//     color: ${colors.primary};
//     border-radius: 30px;
//     &:hover {
//         background-color: ${colors.primary};
//         color: ${colors.backgroundWhite};
//     }
// `;

function Header({ token, setToken }) {
    const location = useLocation();

    function Logout(setToken) {
        setToken(null);
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
                { location.pathname === '/home' &&
                <StyledLink to="/login" onClick={Logout}>
                     Se déconnecter
                </StyledLink>
                }
            </StyledNav>
        </HeaderStyle>
    );
    // else if (location.pathname === '/login') {
    //     return(
    //         <HeaderStyle>
    //             <ImageStyle src= {logo} alt='Logo Groupomania'></ImageStyle>
    //             <StyledNav>
    //                 <StyledLink to="/signup">
    //                     Créer un compte
    //                 </StyledLink>
    //                 <ActiveStyledLink to="/login">
    //                     Se connecter
    //                 </ActiveStyledLink>
    //             </StyledNav>
    //         </HeaderStyle>
    //     );
    // } else {
    //     return(
    //         <HeaderStyle>
    //         <ImageStyle src= {logo} alt='Logo Groupomania'></ImageStyle>
    //         <StyledNav>
    //             <StyledLink to="/login" onClick={Logout}>
    //                 Se déconnecter
    //             </StyledLink>
    //         </StyledNav>
    //     </HeaderStyle>
    //     );
    // }
}

export default Header;