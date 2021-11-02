import UsersService from "#root/adapters/UsersService";

const deleteUserSessionResolver = async (obj, {session_id}, context) => {
    const userSession = await UsersService.deleteUserSession({session_id});
    context.res.clearCookie("userSessionId");
    return true;
};

export default deleteUserSessionResolver;

