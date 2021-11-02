import CodesService from "#root/adapters/CodesService";

const deleteMediaProductResolver = async (obj,{media_product_id}) => {

  return await CodesService.deleteMediaProduct({media_product_id});

};

export default deleteMediaProductResolver;

