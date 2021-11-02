import MediasService from "#root/adapters/MediasService";

const createCategoryResolver = async (obj,{category_name, category_slug, category_desc}) => {

  return await MediasService.createCategory({category_name, category_slug, category_desc});

};

export default createCategoryResolver;

