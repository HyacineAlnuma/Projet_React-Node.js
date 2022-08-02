import logo from '../../assets/icon-left-font.png';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import colors from '../../utils/style/colors'

const HeaderStyle = styled.div`
    display: flex;
    justify-content: space-between;
    background-color: ${colors.backgroundWhite};
`;

const ImageStyle = styled.img`
    width: 350px;
    height: auto;
    margin-left: 60px;
`;

const StyledNav = styled.nav`
    margin: 50px;
`;

const StyledLink = styled(Link)`
    margin-right: 50px;
`;

function Header() {
    return(
        <HeaderStyle>
            <ImageStyle src= {logo} alt='Logo Groupomania'></ImageStyle>
            <StyledNav>
                <StyledLink to="/">
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