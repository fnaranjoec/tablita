import UsersService from "#root/adapters/UsersService";

const injectSession = async (req, res, next) => {

    const session = await req.session;
    // console.log(req);

    if (req.session.sessionId) {
        const userSession = await UsersService.fetchUserSession({
            session_id: req.session.sessionId
        });
        res.locals.userSession = userSession;
    }

    return next();

};

export default injectSession;
