import Cookies from 'js-cookie';

function setCookie(cookiename, value) {
    Cookies.set(cookiename, value, {
        expires: 1,
        sameSite: 'strict'
    });
};

export default setCookie;