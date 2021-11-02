// import ProductsService from "#root/adapters/ProductsService";
// import MediasService from "#root/adapters/MediasService";
// import CodesService from "#root/adapters/CodesService";
import CouponsService from "#root/adapters/CouponsService";
import CodesService from "../../adapters/CodesService";



const Coupon = {
    commerceType: async (parent, args, context) => {
        return await CouponsService.fetchCommerceTypeById({commerce_type_id: parent.commerce_type_id});
    },
    consummer: async (parent, args, context) => {
        return await CouponsService.fetchConsummerById({consummer_id: parent.consummer_id});
    },
    mediaProduct: async (parent, args, context) => {
        return await CodesService.fetchMediaProductById({media_product_id: parent.media_product_id});
    },

};

export default Coupon;

