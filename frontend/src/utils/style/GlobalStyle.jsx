import { createGlobalStyle } from 'styled-components';
import colors from './colors';

const GlobalStyle = createGlobalStyle`
    * {
        font-family: 'Lato', sans-serif;
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