import jsSHA from 'jssha';

export const validateUsername = (username?: string) => {
    if (!username) {
        return false;
    }
    return username.length >= 3;
};

export const validatePassword = (password?: string) => {
    if (!password) {
        return false;
    }
    return password.length >= 3;
};

export const hash = (value: string): string => {
    const shaObj = new jsSHA('SHA-512', 'TEXT');
    shaObj.update(value);
    return shaObj.getHash('HEX');
};

export const getUUID = () => crypto.randomUUID();