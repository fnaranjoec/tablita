import CouponsService from "#root/adapters/CodesService";

const deleteCommerceTypeResolver = async (obj,{commerce_type_id}) => {

  return await CouponsService.deleteCommerceType({commerce_type_id});

};

export default deleteCommerceTypeResolver;

