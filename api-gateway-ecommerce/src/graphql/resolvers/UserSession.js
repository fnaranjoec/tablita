import UsersService from "#root/adapters/UsersService";

const UserSession = {
    user: async userSession => {
        return await UsersService.fetchUserById({user_id: userSession.user_id});
    }
};

export default UserSession;
