const userSessionResolver = async(obj, args, context) => {
    if (args.me !== true) throw new Error("Unsoported argument value");
    return context.res.locals.userSession;
};


export default userSessionResolver;

