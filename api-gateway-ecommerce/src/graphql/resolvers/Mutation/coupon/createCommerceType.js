import CouponsService from "#root/adapters/CouponsService";

const createCommerceTypeResolver = async (obj,{commerce_type_name}) => {

    return await CouponsService.createCommerceType({commerce_type_name});

};

export default createCommerceTypeResolver;

