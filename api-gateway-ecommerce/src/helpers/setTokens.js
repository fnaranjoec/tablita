import accessEnv from "#root/helpers/accessEnv";
import {sign} from "jsonwebtoken";

const setTokens = async ({userSession}) => {

    // console.log('userSession==>', userSession);

    // SECRET KEYS
    const SECRET_ACCESS_KEY = accessEnv("SECRET_ACCESS_KEY", "SECRET_ACCESS_KEY#SECRET_ACCESS_KEY");
    const SECRET_REFRESH_KEY = accessEnv("SECRET_REFRESH_KEY", "SECRET_REFRESH_KEY#SECRET_REFRESH_KEY");

    // EXPIRATION KEYS
    const EXP_ACCESS_KEY = accessEnv("EXP_ACCESS_KEY", 86400);
    const EXP_REFRESH_KEY = accessEnv("EXP_REFRESH_KEY", 3600);

    if (SECRET_ACCESS_KEY===null || SECRET_REFRESH_KEY===null) return null;

    // Lea expiracion de los tokens se aumenta en segundos
    const accessExp = Math.floor(Date.now() / 1000) + parseInt(EXP_ACCESS_KEY)   ;
    const refreshExp = Math.floor(Date.now() / 1000) + parseInt(EXP_REFRESH_KEY) ;

    const accessUser = {
        user_id: userSession.user_id,
        session_id: userSession.session_id,
    };

    const accessToken = await sign({
            exp: accessExp,
            user: accessUser
        },
        SECRET_ACCESS_KEY
    );

    const refreshUser = {
        user_id: userSession.user_id,
        session_id: userSession.session_id,
        // count: userSession.tokenCount
    };

    const refreshToken = await sign({
            exp: refreshExp,
            user: refreshUser
        },
        SECRET_REFRESH_KEY
    );

    return await { accessToken, refreshToken };

};

export default setTokens;