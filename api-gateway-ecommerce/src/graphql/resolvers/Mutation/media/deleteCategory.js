import MediasService from "#root/adapters/MediasService";

const deleteCategoryResolver = async (obj,{category_id}) => {

  return await MediasService.deleteCategory({category_id});

};

export default deleteCategoryResolver;

