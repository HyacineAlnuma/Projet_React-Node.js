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
`;

const StyledLinkBis = styled(Link)`
    margin-right: 50px;
    font-size: 1.1rem;
    background-color: ${colors.secondary};
    color: ${colors.primary};
    padding: 13px 35px;
    border-radius: 30px;
`;

function Header() {
    const { pathname } = useLocation();

    return(
        <HeaderStyle>
            <ImageStyle src= {logo} alt='Logo Groupomania'></ImageStyle>
            <StyledNav>
                <StyledLink style={ pathname === '/' ? {StyledLink} : {StyledLinkBis}} to="/">
                    Créer un compte
                </StyledLink>
                <StyledLink to="/login">
                    Se connecter
                </StyledLink>
            </StyledNav>
        </HeaderStyle>
    );
}

export default Header;