// import ProductsService from "#root/adapters/ProductsService";
// import UsersService from "#root/adapters/UsersService";
// import MediasService from "#root/adapters/MediasService";
// import CodesService from "#root/adapters/CodesService";
import CouponsService from "#root/adapters/CouponsService";

const CommerceType = {
    coupons: async (parent, args, context) => {
        return await CouponsService.fetchCouponsByCommerceType({code_type_id: parent.code_type_id});
    },
};

export default CommerceType;

