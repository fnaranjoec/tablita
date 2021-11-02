import CodesService from "#root/adapters/CodesService";

const deleteCodeTypeResolver = async (obj,{category_id}) => {

  return await CodesService.deleteCodeType({code_type_id});

};

export default deleteCodeTypeResolver;

