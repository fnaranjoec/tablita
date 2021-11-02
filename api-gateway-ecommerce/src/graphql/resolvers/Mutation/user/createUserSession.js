import UsersService from "#root/adapters/UsersService";
import setTokens from "#root/helpers/setTokens";

const createUserSessionResolver = async (obj, {user_email, user_password}, context) => {
  // Creo una session
  const userSession = await UsersService.createUserSession({user_email, user_password});
  context.res.cookie("userSessionId", userSession.session_id, {httpOnly: true});

  // Actualizo la session con el token inicial
  const userTokens = await setTokens({userSession});
  const sessionUpdated = await UsersService.updateUserSession({
      session_id: userSession.session_id,
      session_access_token: userTokens.accessToken,
      session_refresh_token: userTokens.refreshToken
  });

  return userTokens;
  // return setTokens({userSession});
};

export default createUserSessionResolver;
