import CodesService from "#root/adapters/CodesService";

const createCodeTypeResolver = async (obj,{code_type_name}) => {

  return await CodesService.createCodeType({code_type_name});

};

export default createCodeTypeResolver;

