import UsersService from "#root/adapters/UsersService";
import isEmpty from "lodash/isEmpty";
import { AuthenticationError } from "apollo-server-express";

const usersResolver = async(obj, args, context) => {

    // -------------------------------- AUTENTICACION -----------------------------------
    if (isEmpty(context.req.user)) throw new AuthenticationError("000|Access Token Expired!");

    return await UsersService.fetchAllUsers({args});
};

export default usersResolver;

