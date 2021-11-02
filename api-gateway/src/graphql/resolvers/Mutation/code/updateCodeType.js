import CodesService from "#root/adapters/CodesService";

//{code_type_id, code_type_name, code_type_status}
const updateCodeTypeResolver = async (obj, args, context) => {

  if (!args.code_type_id) {
      return new Error("Code Type ID is missing!");
  }

  // return await CodesService.updateCodeType({code_type_id, code_type_name, code_type_status});
  return await CodesService.updateCodeType({args});

};

export default updateCodeTypeResolver;

