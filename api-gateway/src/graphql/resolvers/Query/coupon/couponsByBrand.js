import CouponsService from "#root/adapters/CouponsService";

const couponsByBrandResolver = async(obj, args, context) => {

    return await  Promise.all([
        CouponsService.countCoupons(),
        await CouponsService.fetchCouponsByBrand({brand_id: args.brand_id})
    ]).then(([totalCount, filteredData]) => {

        return {
            total: totalCount.count,
            filtered: filteredData.count,
            rows: filteredData.rows
        }
    })

};


export default couponsByBrandResolver;

