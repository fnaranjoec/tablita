import MediasService from "#root/adapters/MediasService";

const deleteMediaResolver = async (obj,{media_id}) => {

  return await MediasService.deleteMedia({media_id});

};

export default deleteMediaResolver;

