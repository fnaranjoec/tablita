import ProductsService from "#root/adapters/ProductsService";
import MediasService from "#root/adapters/MediasService";
import CodesService from "#root/adapters/CodesService";



const MediaProduct = {
    media: async (parent, args, context) => {
        return await MediasService.fetchMediaById({media_id: parent.media_id});
    },
    product: async (parent, args, context) => {
        return await ProductsService.fetchProductById({product_id: parent.product_id});
    },
    codeType: async (parent, args, context) => {
        return await CodesService.fetchCodeTypeById({code_type_id: parent.code_type_id});
    },

};

export default MediaProduct;

