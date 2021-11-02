import UsersService from "#root/adapters/UsersService";

// const { GraphQLDateTime } = require('graphql-iso-date');

const rolesResolver = async() => {

    return await UsersService.fetchAllRoles();
};


export default rolesResolver;

