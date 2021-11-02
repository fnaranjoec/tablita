import MediasService from "#root/adapters/MediasService";

//{category_id, category_name, category_slug, category_desc, category_status}
const updateCategoryResolver = async (obj, args, context) => {

  if (!args.category_id) {
      return new Error("Category ID is missing!");
  }

  return await MediasService.updateCategory({args});

};

export default updateCategoryResolver;

