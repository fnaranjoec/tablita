import UsersService from "#root/adapters/UsersService";

const deleteUserResolver = async (obj, {user_id}) => {

  return await UsersService.deleteUser({user_id});

};

export default deleteUserResolver;

