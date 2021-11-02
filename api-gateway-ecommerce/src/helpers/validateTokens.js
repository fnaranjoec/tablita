import accessEnv from "#root/helpers/accessEnv";
import { verify } from "jsonwebtoken";

const validateAccessToken = (token) => {
    // SECRET KEYS
    const SECRET_ACCESS_KEY = accessEnv("SECRET_ACCESS_KEY", null);

    if (SECRET_ACCESS_KEY===null) return null;

    // console.log(`Toke=${token}, KEY=${SECRET_ACCESS_KEY}`);
    // console.log('verify==>', verify(token, SECRET_ACCESS_KEY));

    try {
        return verify(token, SECRET_ACCESS_KEY);
    } catch (e) {
        // console.log("error: validateAccessToken ==>", e)
        return null;
    }
};

const validateRefreshToken = (token) => {
    // SECRET KEYS
    const SECRET_REFRESH_KEY = accessEnv("SECRET_REFRESH_KEY", null);

    if (SECRET_REFRESH_KEY===null) return null;

    try {
        return verify(token, SECRET_REFRESH_KEY);
    } catch (e) {
        // console.log("error: validateRefreshToken ==>", e)
        return null;
    }
};

export {validateAccessToken, validateRefreshToken};