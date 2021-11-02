import CouponsService from "#root/adapters/CodesService";

//{code_type_id, code_type_name, code_type_status}
const updateConsummerResolver = async (obj, args, context) => {

  if (!args.consummer_id) {
      return new Error("Consummer ID is missing!");
  }

  return await CouponsService.updateConsummer({args});

};

export default updateConsummerResolver;

