import CouponsService from "#root/adapters/CodesService";

//{code_type_id, code_type_name, code_type_status}
const updateCommerceTypeResolver = async (obj, args, context) => {

  if (!args.commerce_type_id) {
      return new Error("Commerce Type ID is missing!");
  }

  return await CouponsService.updateCommerceType({args});

};

export default updateCommerceTypeResolver;

