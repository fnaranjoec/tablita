import UsersService from "#root/adapters/UsersService";
import { AuthenticationError } from "apollo-server-express";

// logged in user resolver
const isEmpty = require("lodash/isEmpty");
const loggedInUser = async(_, __, { req }) => {

    if (isEmpty(req.user)) throw new AuthenticationError("Access Token Expired!");
    const user = await UsersService.fetchUserById({ user_id: req.user.id });
    return user;

}

export default  loggedInUser;