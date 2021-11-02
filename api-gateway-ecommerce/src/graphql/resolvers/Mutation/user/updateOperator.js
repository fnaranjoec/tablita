import UsersService from "#root/adapters/UsersService";

// {user_id, user_name, user_email, user_phone, user_password, user_status}

const updateUserResolver = async (obj, args, context) => {

    if (!args.user_id) {
        return new Error("Operator ID is missing!");
    }

    // return await UsersService.updateUser({user_id, user_name, user_email, user_phone, user_password, user_status});
    return await UsersService.updateUser({args});

};

export default updateUserResolver;

