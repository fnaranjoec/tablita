import UsersService from "#root/adapters/UsersService";
const isEmpty = require("lodash/isEmpty");

const injectSession = async(req, res, next) => {

  console.log('req.cookies ==> ', req.cookies);

  if (!req.cookies.userSessionId) {
    // OK res.locals.userSession = null;

    // return next(new Error('Session Id is invalid!'));
    return next();
    // OK return req.end();

    // return res.status(500).json({message:"No Session active yet!"});
  }

  const userSession = await UsersService.fetchUserSessionById({session_id: req.cookies.userSessionId});

  if (isEmpty(userSession, true)) {
      // OK res.locals.userSession = null
      return res.status(500).json({message: "Session Id is invalid or expired!"})
  }

  res.locals.userSession = userSession;
  return req.next();




};

export default injectSession;
