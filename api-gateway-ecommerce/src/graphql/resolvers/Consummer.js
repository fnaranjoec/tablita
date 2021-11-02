// import ProductsService from "#root/adapters/ProductsService";
// import UsersService from "#root/adapters/UsersService";
// import MediasService from "#root/adapters/MediasService";
// import CodesService from "#root/adapters/CodesService";
import CouponsService from "#root/adapters/CouponsService";

const Consummer = {
    coupons: async (parent, args, context) => {
        return await CouponsService.fetchCouponsByConsummer({consummer_id: parent.consummer_id});
    },
};

export default Consummer;

