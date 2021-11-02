import CouponsService from "#root/adapters/CouponsService";

const createConsummerResolver = async (obj, args, context) => {

    // console.log(`voy a : CouponsService.createConsummer`);

    return await CouponsService.createConsummer({args});

};

export default createConsummerResolver;

