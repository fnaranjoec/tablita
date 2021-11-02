// import ProductsService from "#root/adapters/ProductsService";
// import UsersService from "#root/adapters/UsersService";
import MediasService from "#root/adapters/MediasService";

const Category = {

    medias: async (parent, args, context) => {
        return await MediasService.fetchMediasByCategory({category_id: parent.category_id});
        // return await MediasService.fetchAllMedias({args});
    },
};

export default Category;

