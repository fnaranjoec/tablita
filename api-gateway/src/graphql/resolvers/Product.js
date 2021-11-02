import ProductsService from "#root/adapters/ProductsService";
import CodesService from "#root/adapters/CodesService";


const Product = {

    brand: async (parent, args, context) => {
        return await ProductsService.fetchBrandById({brand_id: parent.brand_id});
    },
    mediaProducts: async (parent, args, context) => {
        return await CodesService.fetchMediaProductByProduct({product_id: parent.product_id});
    },
};

export default Product;

