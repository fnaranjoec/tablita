// import ProductsService from "#root/adapters/ProductsService";
// import UsersService from "#root/adapters/UsersService";
import MediasService from "#root/adapters/MediasService";
import CodesService from "#root/adapters/CodesService";

const Media = {
    category: async (parent, args, context) => {
        return await MediasService.fetchCategoryById({category_id: parent.category_id});
    },
    mediaProducts: async (parent, args, context) => {
        return await CodesService.fetchMediaProductsByMedia({media_id: parent.media_id});
    },
};

export default Media;

