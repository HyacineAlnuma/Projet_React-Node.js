import { createGlobalStyle } from 'styled-components';
import colors from './colors';

const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;500&display=swap');
    * {
        font-family: 'Roboto', sans-serif;
        font-size: 17px;
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        text-decoration: none;
    }
    body {
        background-color: ${colors.backgroundLight};
    }
`;

export default GlobalStyle;