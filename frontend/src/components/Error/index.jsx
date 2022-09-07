import styled from 'styled-components';
import colors from '../../utils/style/colors';
import Logo from '../../assets/icon-left-font-monochrome-black.svg';

const ErrorWrapper = styled.div`
    margin: 4% 30px 30px 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: ${colors.tertiary}
`;

const ErrorTitle = styled.h1`
    margin-top: 30px;
    font-weight: bold;
    font-size: 2rem;
`;

const ErrorSubtitle = styled.h2`
    margin-top: 15px;
    font-weight: bold;
    font-size: 1.5rem;
`;

const Illustration = styled.img`
    width: 375px;
`;

function Error() {

    return (
    <ErrorWrapper>
    <Illustration src={Logo} />
        <ErrorTitle>Oups...</ErrorTitle>
        <ErrorSubtitle>Il semblerait que la page que vous cherchez n’existe pas</ErrorSubtitle>
    </ErrorWrapper>
    )
};

export default Error;