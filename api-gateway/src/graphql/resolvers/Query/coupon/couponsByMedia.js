import CouponsService from "#root/adapters/CouponsService";

const couponsByMediaResolver = async(obj, args, context) => {

    return await  Promise.all([
        CouponsService.countCoupons(),
        await CouponsService.fetchCouponsByMedia({media_id: args.media_id})
    ]).then(([totalCount, filteredData]) => {

        return {
            total: totalCount.count,
            filtered: filteredData.count,
            rows: filteredData.rows
        }
    })

};


export default couponsByMediaResolver;

